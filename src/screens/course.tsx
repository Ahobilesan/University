import React from 'react';
import { Loader, List, Breadcrumb, Header, Button, Icon, Modal, Form, Dropdown } from 'semantic-ui-react';
import api from "../backend/api"
import { ICourse } from '../backend/interface';
import { validateCourse } from "../assets/util"
import './shared-styles.scss';

(window as any).api = api

const defaultState = {
    courses: [],
    openCourseModal: false,
    editCourse: false,
    deleteAck: false,
    loading: true,
    listLoading: false,
    offset: [undefined],
    activePage: 0,
    totalPages: 0,
    filter: { name: "" },
    formValidate: false,
    modal: {
        cid: "",
        name: "",
        subjects: [],
        month: "",
    },
    modalFreeze: false
}
class Course extends React.Component {
    state = { ...defaultState }
    throttleFunc: any
    deleteResolve: any = () => { }
    deleteReject: any = () => { }

    render() {
        const sections = [
            { key: 'Home', content: 'Home', href: "/" },
            { key: 'Courses', content: 'Courses', active: true }
        ]

        let { name, month, subjects } = this.state.modal

        return <div className="component-page">
            {!this.state.loading && <div>
                <Breadcrumb icon='right angle' sections={sections} />

                <div className="header-wrapper">
                    <Header as='h1'>Courses</Header>
                    <Button primary onClick={this.toggleAddCourseModal.bind(this)}>Add Course</Button>
                </div>

                <List divided relaxed className="list-data">
                    <List.Item>
                        <List.Content>
                            <List.Header>Name</List.Header>
                        </List.Content>

                        <List.Content>
                            <List.Header>No.Of Teachers</List.Header>
                        </List.Content>

                        <List.Content>
                            <List.Header>No.Of Students</List.Header>
                        </List.Content>

                        <List.Content>
                            <List.Header>Averege Marks</List.Header>
                        </List.Content>
                    </List.Item>
                    {!this.state.listLoading && this.state.courses.map((e: any, i: number) => {
                        return <List.Item key={i} onClick={(_e) => { document.location.replace(`/detail?cid=${e.cid}`); _e.preventDefault() }}>
                            <List.Content>{e.name}</List.Content>

                            <List.Content>{e.teacher.length}</List.Content>

                            <List.Content>{e.student.length}</List.Content>

                            <List.Content>{e.avg}%
                                <div className="action-button-wrapper">
                                    <Dropdown text=" " icon="ellipsis vertical" options={[
                                        { key: 'View', text: 'View', href: `/detail?cid=${e.cid}` },
                                        { key: 'Edit', text: 'Edit', onClick: this.editCourse.bind(this, e) },
                                        { key: 'Delete', text: 'Delete', onClick: this.deleteCourse.bind(this, e) },
                                    ]} />
                                </div>
                            </List.Content>
                        </List.Item>
                    })}
                    {!this.state.listLoading && this.state.courses.length === 0 && <List.Item className="empty-list"><List.Content> No Items Found  </List.Content></List.Item>}
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
            {this.state.loading && <Loader active>Loading Courses</Loader>}
            {/* Modal */}
            <Modal
                open={this.state.openCourseModal}
            >
                <Modal.Header>{this.state.editCourse ? "Edit" : "Add"} Course</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Course name'
                                name="name"
                                disabled={this.state.modalFreeze}
                                placeholder='Course name'
                                required
                                error={this.state.formValidate && !name}
                                value={name}
                                onChange={this.handleFormChange.bind(this)}
                            />
                            <Form.Input
                                label='No.of Months'
                                name="month"
                                type="number"
                                disabled={this.state.modalFreeze}
                                placeholder='No.of Month'
                                required
                                error={this.state.formValidate && !month}
                                value={month}
                                onChange={this.handleFormChange.bind(this)}
                            />
                        </Form.Group>

                        <Form.Button basic disabled={this.state.modalFreeze} onClick={this.addSubject.bind(this)}>Add Subject</Form.Button>

                        {subjects && subjects.map((s: any, i) => {
                            return <Form.Input key={i}
                                label='Subject'
                                type="text"
                                id={String(i)}
                                name="subject"
                                disabled={this.state.modalFreeze}
                                placeholder='Subject'
                                error={this.state.formValidate && !s}
                                value={s}
                                onChange={this.handleFormChange.bind(this)}
                                icon={<Button type="button" basic icon="trash" onClick={this.removeSubject.bind(this, i)} />}
                            />
                        })}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        content="Close"
                        disabled={this.state.modalFreeze}
                        onClick={this.toggleAddCourseModal.bind(this)}
                    />
                    <Button
                        primary
                        content={this.state.editCourse ? "Update" : "Save"}
                        disabled={this.state.modalFreeze}
                        onClick={this.saveCourse.bind(this)}
                    />
                </Modal.Actions>
            </Modal>
            <Modal
                open={this.state.deleteAck}
            >
                <Modal.Header>Delete Acknowledgement</Modal.Header>
                <Modal.Content>Are you sure want to delete {name}'s record?</Modal.Content>
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
        this.getCourseList().then(() => { this.setState({ loading: false }) });
        // (window as any).getState = () => this.state;
    }

    async getCourseList(_offset?: number, filter?: any) {
        this.setState({ listLoading: true })
        try {
            let res: any = await api.course!.readAll(_offset, filter);
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
                    courses: res.results,
                    listLoading: false
                })
            }
        } catch (error) {
            console.log(error)
            this.setState({ courses: [], loading: false })
        }
    }

    async handleNextPage() {
        let { offset } = this.state
        await this.getCourseList(offset[offset.length - 1], this.state.filter)
    }

    async handlePrevPage() {
        let { offset } = this.state
        offset.pop()
        await this.getCourseList(offset[offset.length - 2], this.state.filter)
    }

    toggleAddCourseModal() {
        this.setState((prevState: any) => ({ openCourseModal: !prevState.openCourseModal }), () => {
            // eslint-disable-next-line
            this.state.modal = { ...defaultState.modal, subjects: [] }
            // eslint-disable-next-line
            this.state.formValidate = false;
            // eslint-disable-next-line
            this.state.editCourse = false
            this.forceUpdate()
        })
    }

    addSubject(e: any) {
        let modal = this.state.modal;
        modal.subjects.push("" as never)
        this.setState({ modal })
        e.preventDefault()
    }

    removeSubject(idx: number) {
        let modal = this.state.modal;
        if (idx !== -1)
            modal.subjects.splice(idx, 1)
        this.setState({ modal })
    }

    async handleFormChange(_: any, { name, value, id }: any) {
        let { modal }: any = this.state;
        if (name === "subject") {
            modal.subjects[id] = value
        } else {
            modal[name] = value;
        }
        this.setState({ modal })
    }

    viewCourse() {

    }

    async deleteCourse(data: any) {
        try {
            let promise = new Promise((resolve, reject) => {
                let modal: any = { ...data }
                this.deleteResolve = resolve;
                this.deleteReject = reject;
                this.setState({ modal, deleteAck: true })
            })
            await promise;

            this.setState({ modalFreeze: true })
            let res = await api.course!.delete(this.state.modal.cid)
            if (res.error === false) {
                // eslint-disable-next-line
                this.state.modal = { ...defaultState.modal }

                this.setState({ modalFreeze: false, deleteAck: false })
                this.getCourseList()
            }

        } catch (error) {
            console.log(error)
            // eslint-disable-next-line
            this.state.modal = { ...defaultState.modal }
            this.setState({ modalFreeze: false, deleteAck: false })
        }
    }

    editCourse(data: ICourse) {
        let modal: any = { ...data }
        this.setState({ modal, openCourseModal: true, editCourse: true })
    }

    async saveCourse() {
        let modalData: any = { ...this.state.modal }
        let data: ICourse = {
            cid: modalData.cid,
            name: modalData.name,
            subjects: modalData.subjects,
            month: modalData.month,
        }

        this.setState({ formValidate: true })

        let course = validateCourse(data)
        if (course!.valid !== true) {
            console.log(course.msg)
            return
        }
        this.setState({ modalFreeze: true })
        try {
            let res: any
            if (this.state.editCourse === true) {
                res = await api.course!.update(this.state.modal.cid, data)
            } else {
                res = await api.course!.create(data);
            }

            if (res.error === false) {
                console.log(res)
                this.setState({ modalFreeze: false })
                this.toggleAddCourseModal()
                this.getCourseList()
            }
        } catch (error) {
            console.log(error)
            this.setState({ modalFreeze: false })
            this.toggleAddCourseModal()
        }
    }

}
export default Course;
