import React from 'react';
import { List, Breadcrumb, Header, Button, Icon, Input, Dropdown, Loader, Modal, Form } from 'semantic-ui-react';
import throttle from "lodash.throttle"
import api from "../backend/api"
import { Genders, Grades, GradeMap } from "../assets/data"
import { validateStudent, getVisibleDate, getDate } from "../assets/util"
import { IStudent } from '../backend/interface';
import './shared-styles.scss';

const defaultState = {
  courses: [],
  students: [],
  addStudent: false,
  loading: true,
  listLoading: false,
  offset: [undefined],
  activePage: 0,
  totalPages: 0,
  filter: { name: "", course: "" },
  formValidate: false,
  modal: {
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
  courseOptions: any
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

        <List divided relaxed className="list-data">
          <List.Item className="list-heading">
            <List.Content>
              <List.Header>Student</List.Header>
            </List.Content>
            <List.Content>
              <List.Header>Grades</List.Header>
            </List.Content>
          </List.Item>

          {!this.state.listLoading && this.state.students.map((e: any, i: number) => {
            return <List.Item key={i}>
              <List.Content>
                <div className="details"><span>Name</span>: <span>{e.firstName} {e.lastName}</span></div>
                <div className="details"><span>Email</span>: <span>{e.email}</span></div>
                <div className="details"><span>Gender</span>: <span>{e.gender}</span></div>
                <div className="details"><span>DOB</span>: <span>{getVisibleDate(e.birthday)}</span></div>
                <div className="details"><span>Course</span>: <span>{e.course.name}</span></div>
                <div className="details"><span>REG Number</span>: <span>{e.regNumber}</span></div>
              </List.Content>

              <List.Content>{e.grades.map((s: any, _i: number) => {
                return <div key={_i} className="grades">
                  <List.Description>{s.subject}</List.Description>
                  <List.Description>{s.grade["Letter Grade"]}</List.Description>
                </div>
              })}</List.Content>
            </List.Item>
          })}

          {!this.state.listLoading && this.state.students.length === 0 && <List.Item className="empty-list"><List.Content> No Items Found  </List.Content></List.Item>}
          {this.state.listLoading && <List.Item className="empty-list"><Loader active inline="centered"></Loader></List.Item>}
        </List>
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
        open={this.state.addStudent}
      >
        <Modal.Header>Add Student</Modal.Header>
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
                value={birthday}
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
            content="Save"
            disabled={this.state.modalFreeze}
            onClick={this.saveStudent.bind(this)}
          />
        </Modal.Actions>
      </Modal>
    </div >
  }

  componentDidMount() {
    Promise.all(([this.getStudentList(), this.getCourseList()])).then(() => { this.setState({ loading: false }) });
    (window as any).getState = () => this.state;
  }

  async getCourseList() {
    try {
      let res = await api.course!.readAll();
      if (res.error === false) {
        console.log(res)
        this.setState({ courses: res.results })
        this.courseOptions = []
        for (let i = 0; i < res.results.length; i++) {
          const element = res.results[i];
          this.courseOptions.push({ key: element.name, text: element.name, value: element.name })
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
        console.log(res)

        let { offset } = this.state
        if (offset.indexOf(res.offset.toString()) === -1) {
          offset.push(res.offset.toString())
        }

        this.setState({
          offset,
          totalPages: res.limit,
          activePage: res.active,
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
    console.log(name, value)
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
    this.setState((prevState: any) => ({ addStudent: !prevState.addStudent }), () => {
      this.state.modal = { ...defaultState.modal }
      this.state.formValidate = false;
      this.forceUpdate()
    })
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
    let modalData: any = { sid: "", ...this.state.modal }
    let data: IStudent = {
      sid: "",
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
      let res: any = await api.student!.create(data);
      if (res.error === false) {
        console.log(res)

        this.setState({ modalFreeze: false })
        this.toggleAddStudentModal()
        this.getStudentList()
      }

    } catch (error) {
      console.log(error)
      this.setState({ modal: defaultState.modal })
    }
  }
}
export default Students;
