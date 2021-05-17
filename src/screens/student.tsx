import React from 'react';
import { Breadcrumb, Header, Button, Icon, Input, Dropdown, Loader, Modal, Form } from 'semantic-ui-react';
import throttle from "lodash.throttle"
import api from "../backend/api"
import { Genders, Grades, GradeMap } from "../assets/data"
import { validateStudent, getDate } from "../assets/util"
import { IStudent } from '../backend/interface';

import StudentList from "../component/student-list"
import './shared-styles.scss';

const defaultState = {
  courses: [],
  students: [],
  openStudentModal: false,
  editStudent: false,
  deleteAck: false,
  loading: true,
  listLoading: false,
  offset: [undefined],
  activePage: 0,
  totalPages: 0,
  filter: { name: "", course: "" },
  formValidate: false,
  modal: {
    sid: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    regNumber: "",
    birthday: "",
    course: "",
    grades: [],
    selectedCourse: { subjects: [] }
  },
  modalFreeze: false
}

class Students extends React.Component {
  state = { ...defaultState }
  throttleFunc: any
  courseOptions: any = []
  deleteResolve: any = () => { }
  deleteReject: any = () => { }
  constructor(props: any) {
    super(props)
    this.throttleFunc = throttle(this.handleSearch.bind(this), 900, { leading: false, trailing: true });
  }

  render() {
    const sections = [
      { key: 'Home', content: 'Home', href: "/" },
      { key: 'Students', content: 'Students', active: true }
    ]

    let { firstName, lastName, email, gender, regNumber, birthday, course, grades } = this.state.modal

    return <div className="component-page">
      {!this.state.loading && <div>
        <Breadcrumb icon='right angle' sections={sections} />

        <div className="header-wrapper">
          <Header as='h1'>Students</Header>
          <Button primary onClick={this.toggleAddStudentModal.bind(this)}>Add Student</Button>
        </div>

        <div className="filter">
          <Input icon='search' placeholder='Search by name of the Student' name="name" onChange={this.throttleFunc.bind(this)} />
          <Dropdown placeholder='Course' search selection options={this.courseOptions} name="course" onChange={this.throttleFunc.bind(this)} />
        </div>

        <StudentList students={[...this.state.students]} onEdit={this.editStudent.bind(this)} onDelete={this.deleteStudent.bind(this)} loading={this.state.listLoading} />

        <div className="pagination">
          <Button.Group>
            <Button basic disabled={this.state.offset.length < 3 || this.state.listLoading} primary icon labelPosition='left' onClick={this.handlePrevPage.bind(this)} >Prev<Icon name="arrow left" /></Button>
            <Button basic disabled>
              {!this.state.listLoading && <span>{this.state.activePage} of {this.state.totalPages}</span>}
              {this.state.listLoading && <Loader active inline="centered" size="tiny"></Loader>}
            </Button>
            <Button basic disabled={this.state.activePage === this.state.totalPages || this.state.listLoading} primary icon labelPosition='right' onClick={this.handleNextPage.bind(this)} >Next<Icon name="arrow right" /></Button>
          </Button.Group>
        </div>
      </div>}

      {this.state.loading && <Loader active>Loading Students</Loader>}

      {/* Modal */}
      <Modal
        open={this.state.openStudentModal}
      >
        <Modal.Header>{this.state.editStudent ? "Edit" : "Add"} Student</Modal.Header>
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
                label='Reg Number'
                type="number"
                name="regNumber"
                disabled={this.state.modalFreeze}
                placeholder='Reg Number'
                required
                maxLength={10}
                error={this.state.formValidate && !regNumber}
                value={regNumber}
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Select
                label='Course'
                name="course"
                options={this.courseOptions}
                disabled={this.state.modalFreeze}
                placeholder='Course'
                required
                error={this.state.formValidate && !course}
                value={course}
                onChange={this.handleFormChange.bind(this)}
              />
            </Form.Group>

            {course && this.state.modal.selectedCourse &&
              this.state.modal.selectedCourse.subjects &&
              this.state.modal.selectedCourse.subjects.map((s: any, i) => {
                if (grades[i] === undefined) {
                  (grades[i] as any) = { subject: "", grade: "" }
                }
                return <Form.Group widths='equal' key={i}>
                  <Form.Input
                    label='Subject'
                    type="text"
                    name="subject"
                    readOnly
                    disabled={this.state.modalFreeze}
                    placeholder='Subject'
                    value={s}
                  />
                  <Form.Select
                    label='Grade'
                    name={`${i}|${s}`}
                    options={Grades}
                    disabled={this.state.modalFreeze}
                    placeholder='Grade'
                    required
                    error={this.state.formValidate && !(grades[i] as any).grade}
                    value={(grades[i] as any).grade}
                    onChange={this.handlegrades.bind(this)}
                  />
                </Form.Group>
              })}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            content="Close"
            disabled={this.state.modalFreeze}
            onClick={this.toggleAddStudentModal.bind(this)}
          />
          <Button
            primary
            content={this.state.editStudent ? "Update" : "Save"}
            disabled={this.state.modalFreeze}
            onClick={this.saveStudent.bind(this)}
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
    </div >
  }

  componentDidMount() {
    Promise.all(([this.getStudentList(), this.getCourseList()])).then(() => { this.setState({ loading: false }) });
    // (window as any).getState = () => this.state;
  }

  async getCourseList() {
    try {
      let res = await api.course!.readAll();
      if (res.error === false) {
        this.setState({ courses: res.results })
        this.courseOptions = []
        for (let i = 0; i < res.results.length; i++) {
          const element = res.results[i];
          this.courseOptions.push({ key: element.cid, text: element.name, value: element.cid })
        }
      }
    } catch (error) {
      console.log(error)
      this.setState({ courses: [] })
    }
  }

  async getStudentList(_offset?: number, filter?: any) {
    this.setState({ listLoading: true })
    try {
      let res: any = await api.student!.readAll(_offset, filter);
      if (res.error === false) {
        let { offset } = this.state
        if (offset.indexOf(res.offset.toString()) === -1) {
          offset.push(res.offset.toString())
        }

        this.setState({
          offset,
          totalPages: res.limit,
          activePage: res.limit > 0 ? res.active : 0,
          students: res.results,
          listLoading: false
        })
      }
    } catch (error) {
      console.log(error)
      this.setState({ students: [], listLoading: false })
    }
  }

  handleSearch(_: any, { name, value }: any) {
    let { filter }: any = this.state;
    filter[name] = value

    this.setState({ filter, offset: [undefined] })
    this.getStudentList(undefined, filter)
  }

  async handleNextPage() {
    let { offset } = this.state
    await this.getStudentList(offset[offset.length - 1], this.state.filter)
  }

  async handlePrevPage() {
    let { offset } = this.state
    offset.pop()
    await this.getStudentList(offset[offset.length - 2], this.state.filter)
  }

  async handleFormChange(_: any, { name, value }: any) {
    let { modal }: any = this.state;
    modal[name] = value
    if (name === "course") {
      let course = this.state.courses.filter((r: any) => r.cid === value)
      modal.selectedCourse = course[0]
    }

    this.setState({ modal })
  }

  handlegrades(_: any, { name, value }: any) {
    let { modal }: any = this.state;
    let arr = name.split("|")
    modal.grades[arr[0]] = { subject: arr[1], grade: value }

    this.setState({ modal })
  }

  toggleAddStudentModal() {
    this.setState((prevState: any) => ({ openStudentModal: !prevState.openStudentModal }), () => {
      // eslint-disable-next-line
      this.state.modal = { ...defaultState.modal }
      // eslint-disable-next-line
      this.state.formValidate = false;
      // eslint-disable-next-line
      this.state.editStudent = false
      this.forceUpdate()
    })
  }

  async deleteStudent(_: any, data: any) {
    try {
      let promise = new Promise((resolve, reject) => {
        let modal: any = { ...data }
        this.deleteResolve = resolve;
        this.deleteReject = reject;
        this.setState({ modal, deleteAck: true })
      })
      await promise;

      this.setState({ modalFreeze: true })
      let res = await api.student!.delete(this.state.modal.sid)
      if (res.error === false) {
        // eslint-disable-next-line
        this.state.modal = { ...defaultState.modal }

        this.setState({ modalFreeze: false, deleteAck: false })
        this.getStudentList()
      }

    } catch (error) {
      console.log(error)
      // eslint-disable-next-line
      this.state.modal = { ...defaultState.modal }
      this.setState({ modalFreeze: false, deleteAck: false })
    }
  }

  editStudent(_: any, data: IStudent) {
    let modal: any = { ...data }
    modal.course = data.course.name;
    modal.selectedCourse = data.course
    modal.grades = data.grades.map((g) => {
      return { ...g, grade: g.grade["Letter Grade"] }
    })
    this.setState({ modal, openStudentModal: true, editStudent: true })
  }

  addGrades(data: any) {
    let array = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let idx = GradeMap.findIndex((g: any) => g["Letter Grade"] === element.grade)
      if (idx !== -1) {
        array.push({ ...element, grade: GradeMap[idx] })
      }
    }
    return array
  }

  async saveStudent() {
    let modalData: any = { ...this.state.modal }
    let data: IStudent = {
      sid: modalData.sid,
      firstName: modalData.firstName,
      lastName: modalData.lastName,
      email: modalData.email,
      gender: modalData.gender,
      regNumber: modalData.regNumber,
      birthday: modalData.birthday,
      course: modalData.selectedCourse,
      grades: this.addGrades(modalData.grades),
    }

    this.setState({ formValidate: true })

    let student = validateStudent(data)
    if (student!.valid !== true) {
      return
    }

    this.setState({ modalFreeze: true })
    try {
      let res: any
      if (this.state.editStudent === true) {
        res = await api.student!.update(this.state.modal.sid, data)
      } else {
        res = await api.student!.create(data);
      }

      if (res.error === false) {
        this.setState({ modalFreeze: false })
        this.toggleAddStudentModal()
        this.getStudentList()
      }

    } catch (error) {
      console.log(error)
      this.setState({ modalFreeze: false })
      this.toggleAddStudentModal()
    }
  }
}
export default Students;
