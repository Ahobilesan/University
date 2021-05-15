import React from 'react';
import { List, Breadcrumb, Header, Button, Icon, Input, Dropdown, Loader, Modal, Form } from 'semantic-ui-react';
import api from "../backend/api"
import { Genders, Courses, Grades } from "../assets/data"
import throttle from "lodash.throttle"
import './shared-styles.scss';

const defaultState = {
  students: [],
  addStudent: false,
  loading: true,
  listLoading: false,
  offset: [undefined],
  activePage: 0,
  totalPages: 0,
  filter: { name: "", course: "" },
  modal: {}
}
class Students extends React.Component {
  state = { ...defaultState }
  throttleFunc: any
  constructor(props: any) {
    super(props)
    this.throttleFunc = throttle(this.handleSearch.bind(this), 900, { leading: false, trailing: true });

  }

  render() {
    let getDOB = (ts: string) => {
      var date = new Date(parseFloat(ts));
      return `${date.getDay()}/${date.getMonth() + 1}/${date.getUTCFullYear()}`
    }

    const sections = [
      { key: 'Home', content: 'Home', href: "/" },
      { key: 'Students', content: 'Students', active: true }
    ]

    return <div className="page">
      <Breadcrumb icon='right angle' sections={sections} />

      <div className="header-wrapper">
        <Header as='h1'>Students</Header>
        <Button primary onClick={this.toggleAddStudentModal.bind(this)}>Add Student</Button>
      </div>

      <div className="filter">
        <Input icon='search' placeholder='Search by name of the Student' name="name" onChange={this.throttleFunc.bind(this)} />
        <Dropdown placeholder='Course' search selection options={Courses} name="course" onChange={this.throttleFunc.bind(this)} />
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
              <div className="details"><span>DOB</span>: <span>{getDOB(e.birthday)}</span></div>
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

      {/* Modal */}
      <Modal
        open={this.state.addStudent}
      >
        <Modal.Header>Add Student</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                label='First name'
                control='input'
                placeholder='First name'
              />
              <Form.Field
                label='Last name'
                control='input'
                placeholder='Last name'
              />
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Field
                label='Email'
                type="email"
                control='input'
                placeholder='Email'
              />
              <Form.Field
                label='Date Of Birth'
                control='input'
                type="date"
                placeholder='Birthday'
              />
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Field
                label='Reg Number'
                type="number"
                control='input'
                placeholder='Reg Number'
              />
              <Form.Select
                label='Gender'
                options={Genders}
                placeholder='Gender'
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Select
                label='Course'
                options={Courses}
                placeholder='Course'
              />
              <Form.Select
                label='Grade'
                options={Grades}
                placeholder='Grade'
              />
            </Form.Group>
            {/* <Button type='submit'>Submit</Button> */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            content="Close"
            onClick={this.toggleAddStudentModal.bind(this)}
          />
        </Modal.Actions>
      </Modal>
    </div >
  }

  componentDidMount() {
    this.getStudentList();
    (window as any).getState = () => { return this.state }
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
          listLoading: false,
          loading: false
        })
      }
    } catch (error) {
      console.log(error)
      this.setState({ students: [], listLoading: false, loading: false })
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

  toggleAddStudentModal() {
    this.setState((prevState: any) => ({ addStudent: !prevState.addStudent }))
  }

  saveStudent() {

  }
}
export default Students;
