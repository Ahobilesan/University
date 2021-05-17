import React from 'react';
import { Message, Breadcrumb, Header, Button, Accordion, Icon, Tab, List, Dropdown, Modal, Form, Loader } from "semantic-ui-react"
import api from "../backend/api"
import { validateTeacher, getDate, getVisibleDate, getCurrency } from "../assets/util"
import { Genders } from "../assets/data"
import StudentList from "../component/student-list"
import './shared-styles.scss';
import { ITeacher } from '../backend/interface';

const defaultState = {
  cid: "",
  course: { name: "", subjects: [], student: [], teacher: [] },
  openTeacherModal: false,
  editTeacher: false,
  deleteAck: false,
  loading: true,
  listLoading: false,
  invalidID: false,
  activeIndex: -1,
  totalPages: 0,
  filter: { name: "" },
  formValidate: false,
  modal: {
    tid: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthday: "",
    salary: "",
    subjects: []
  },
  modalFreeze: false
}
class Detail extends React.Component {
  state = { ...defaultState }
  throttleFunc: any
  deleteResolve: any = () => { }
  deleteReject: any = () => { }

  render() {
    let { course, activeIndex } = this.state;

    const sections = [
      { key: 'Home', content: 'Home', href: "/" },
      { key: 'Courses', content: 'Courses', href: "/courses" },
      { key: course.name, content: course.name, active: true }
    ]

    let { firstName, lastName, email, gender, birthday, salary } = this.state.modal

    return <div className="component-page">
      {!this.state.loading && <div>
        {this.state.invalidID && <Message icon="exclamation circle" info header='Your URL is invalid' content={<div>Go back to {<a href="/courses">Course</a>}.</div>} />}
        {!this.state.invalidID && <div>
          <Breadcrumb icon='right angle' sections={sections} />

          <div className="header-wrapper">
            <Header as='h1'>{course.name}</Header>
          </div>

          {course.subjects && course.subjects.map((e, i) => {
            return <Accordion fluid styled key={i} className="subjects">
              <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
                {e}
                <Icon name='dropdown' />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === i}>
                <Tab renderActiveOnly panes={[
                  { menuItem: 'Teacher', render: () => <Tab.Pane>{this.getTeacherDetails(e, i)}</Tab.Pane> },
                  { menuItem: 'Students', render: () => <Tab.Pane>{this.getStudentsDetails(e, i)}</Tab.Pane> }
                ]} />
              </Accordion.Content>
            </Accordion>
          })}

          {!this.state.listLoading && course.subjects.length === 0 && <List.Item className="empty-list"><List.Content> No Items Found  </List.Content></List.Item>}
          {this.state.listLoading && <List.Item className="empty-list"><Loader active inline="centered"></Loader></List.Item>}

        </div>}
      </div>}
      {/* Modal */}
      <Modal
        open={this.state.openTeacherModal}
      >
        <Modal.Header>{this.state.editTeacher ? "Edit" : "Add"} Course</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input
                label='First name'
                name="firstName"
                disabled={this.state.modalFreeze}
                placeholder='First name'
                required
                error={this.state.formValidate && !firstName}
                value={firstName}
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Input
                label='Last name'
                name="lastName"
                disabled={this.state.modalFreeze}
                placeholder='Last name'
                required
                error={this.state.formValidate && !lastName}
                value={lastName}
                onChange={this.handleFormChange.bind(this)}
              />
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Input
                label='Email'
                type="email"
                name="email"
                disabled={this.state.modalFreeze}
                placeholder='Email'
                required
                error={this.state.formValidate && !email}
                value={email}
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Input
                label='Date Of Birth'
                name="birthday"
                type="date"
                disabled={this.state.modalFreeze}
                placeholder='Birthday'
                required
                max={getDate()}
                error={this.state.formValidate && !birthday}
                value={getDate(birthday)}
                onChange={this.handleFormChange.bind(this)}
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Select
                label='Gender'
                name="gender"
                options={Genders}
                disabled={this.state.modalFreeze}
                placeholder='Gender'
                required
                error={this.state.formValidate && !gender}
                value={gender}
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Input
                label='Salary'
                type="number"
                name="salary"
                disabled={this.state.modalFreeze}
                placeholder='Salary'
                required
                maxLength={10}
                error={this.state.formValidate && !salary}
                value={salary}
                onChange={this.handleFormChange.bind(this)}
              />
            </Form.Group>

            {this.state.modal &&
              this.state.modal.subjects &&
              this.state.modal.subjects.map((s: any, i) => {
                return <Form.Input key={i}
                  label='Subject'
                  type="text"
                  name="subject"
                  readOnly
                  disabled={this.state.modalFreeze}
                  placeholder='Subject'
                  value={s}
                />
              })}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            content="Close"
            disabled={this.state.modalFreeze}
            onClick={this.toggleAddTeacherModal.bind(this)}
          />
          <Button
            primary
            content={this.state.editTeacher ? "Update" : "Save"}
            disabled={this.state.modalFreeze}
            onClick={this.saveTeacher.bind(this)}
          />
        </Modal.Actions>
      </Modal>
      <Modal
        open={this.state.deleteAck}
      >
        <Modal.Header>Delete Acknowledgement</Modal.Header>
        <Modal.Content>Are you sure want to delete {firstName} {lastName}'s record?</Modal.Content>
        <Modal.Actions>
          <Button
            basic
            content="Cancel"
            disabled={this.state.modalFreeze}
            onClick={this.deleteReject.bind(this)}
          />
          <Button
            primary
            content="Delete"
            disabled={this.state.modalFreeze}
            onClick={this.deleteResolve.bind(this)}
          />
        </Modal.Actions>
      </Modal>
    </div>
  }

  componentDidMount() {
    let params = (new URL(document.location.href)).searchParams;
    let cid: any = params.get("cid")
    if (!cid) {
      this.setState({ invalidID: true })
      return
    } else {
      this.setState({ cid })
    }
    this.getCourse(cid).then(() => { this.setState({ loading: false }) });
    (window as any).getState = () => this.state;
  }

  async getCourse(cid: string) {
    this.setState({ listLoading: true })
    try {
      let res: any = await api.course!.read(cid);
      if (res.error === false) {
        console.log(res)

        this.setState({
          course: { ...res.result },
          listLoading: false
        })
      }
    } catch (error) {
      console.log(error)
      this.setState({ courses: [], loading: false })
    }
  }

  handleClick = (_: any, titleProps: any) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  async handleFormChange(_: any, { name, value }: any) {
    let { modal }: any = this.state;
    modal[name] = value
    this.setState({ modal })
  }

  getTeacherDetails(e: any, i: any) {
    if (this.state.activeIndex !== i) return
    console.log(e, i)
    let teachers = this.state.course.teacher.filter((r: any) => {
      return r.subjects.indexOf(e) !== -1
    })
    console.log(e, i)
    return <List divided relaxed className="list-data">
      {teachers.map((t: any, i: any) => {
        return <List.Item key={i}>
          <List.Content>
            <div className="details">
              <Dropdown compact trigger={<span >{t.firstName} {t.lastName}</span>} options={[
                { key: 'Edit', text: 'Edit', onClick: this.editTeacher.bind(this, t) },
                { key: 'Delete', text: 'Delete', onClick: this.deleteTeacher.bind(this, t) },
              ]} />
              {/* <List.Header>{t.firstName} {t.lastName}</List.Header> */}
            </div>
            <div className="details"><span>Email</span>: <span>{t.email}</span></div>
            <div className="details"><span>Gender</span>: <span>{t.gender}</span></div>
            <div className="details"><span>DOB</span>: <span>{getVisibleDate(t.birthday)}</span></div>
            <div className="details"><span>Salary</span>: <span>{getCurrency(t.salary)}</span></div>
          </List.Content>
        </List.Item>
      })}
    </List>
  }

  getStudentsDetails(e: any, i: any) {
    if (this.state.activeIndex !== i) return
    console.log(e, i)
    let students = this.state.course.student.filter((r: any) => {
      return r.grades.findIndex((s: any) => s.subject === e) !== -1
    })
    console.log(e, i)
    return <List divided relaxed className="student-list-data">
      {students.map((s: any, i: any) => {
        return <List.Item key={i}>
          <List.Content>
            <div className="details">
              <List.Header>{s.firstName} {s.lastName}</List.Header>
            </div>
          </List.Content>
          {s.grades.map((g: any, _i: any) => {
            if (g.subject === e) {
              return <List.Content>
                <div className="details">
                  <List.Header>{g.grade["Letter Grade"]}</List.Header>
                </div>
              </List.Content>
            } else {
              return
            }

          })}
        </List.Item>
      })}
    </List>
  }
  async deleteTeacher(data: ITeacher) {
    try {
      let promise = new Promise((resolve, reject) => {
        let modal: any = { ...data }
        this.deleteResolve = resolve;
        this.deleteReject = reject;
        this.setState({ modal, deleteAck: true })
      })
      await promise;

      this.setState({ modalFreeze: true })
      let res = await api.teacher!.delete(this.state.modal.tid)
      if (res.error === false) {
        this.state.modal = { ...defaultState.modal }

        this.setState({ modalFreeze: false, deleteAck: false })
        this.getCourse(this.state.cid)
      }

    } catch (error) {
      console.log(error)
      this.state.modal = { ...defaultState.modal }
      this.setState({ modalFreeze: false, deleteAck: false })
    }
  }

  toggleAddTeacherModal() {
    this.setState((prevState: any) => ({ openTeacherModal: !prevState.openTeacherModal }), () => {
      this.state.modal = { ...defaultState.modal }
      this.state.formValidate = false;
      this.state.editTeacher = false
      this.forceUpdate()
    })
  }

  editTeacher(data: ITeacher) {
    console.log(data)
    let modal: any = { ...data }
    this.setState({ modal, openTeacherModal: true, editTeacher: true })
  }

  async saveTeacher() {
    let modalData: any = { ...this.state.modal }
    let data: ITeacher = {
      tid: modalData.sid,
      firstName: modalData.firstName,
      lastName: modalData.lastName,
      email: modalData.email,
      gender: modalData.gender,
      salary: modalData.salary,
      birthday: modalData.birthday,
      subjects: modalData.subjects
    }

    this.setState({ formValidate: true })

    let teacher = validateTeacher(data)
    if (teacher!.valid !== true) {
      console.log(teacher.msg)
      return
    }

    this.setState({ modalFreeze: true })
    try {
      let res: any
      if (this.state.editTeacher === true) {
        res = await api.teacher!.update(this.state.modal.tid, data)
      } else {
        res = await api.teacher!.create(data);
      }

      if (res.error === false) {
        this.setState({ modalFreeze: false })
        this.toggleAddTeacherModal()
        this.getCourse(this.state.cid)
      }

    } catch (error) {
      console.log(error)
      this.setState({ modalFreeze: false })
      this.toggleAddTeacherModal()
    }
  }

}
export default Detail;
