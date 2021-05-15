import React from 'react';
import { Loader, List, Breadcrumb, Header } from 'semantic-ui-react';
import api from "../backend/api"
import './shared-styles.scss';

(window as any).api = api

const defaultState = { courses: [{ name: "MBA", teachers: "10", students: "50", avg: "60" }], loading: true, listLoading: false, }
class Course extends React.Component {
    state = { ...defaultState }

    render() {
        const sections = [
            { key: 'Home', content: 'Home', href: "/" },
            { key: 'Courses', content: 'Courses', active: true }
        ]
        return <div className="page">
            {!this.state.loading && <div>
                <Breadcrumb icon='right angle' sections={sections} />

                <Header as='h1'>Courses</Header>
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
                    {this.state.courses.map((e: any, i: number) => {
                        return <List.Item key={i}>
                            <List.Content>{e.name}</List.Content>

                            <List.Content>{e.teacher.length}</List.Content>

                            <List.Content>{e.student.length}</List.Content>

                            <List.Content>{e.avg}</List.Content>
                        </List.Item>
                    })}
                    {this.state.courses.length === 0 && <List.Item className="empty-list"><List.Content> No Items Found  </List.Content></List.Item>}
                </List>
            </div>}
            {this.state.loading && <Loader active>Loading Courses</Loader>}
        </div>
    }

    componentDidMount() {
        this.getCourseList()
    }

    async getCourseList() {
        try {
            let res = await api.course!.readAll();
            if (res.error === false) {
                console.log(res)
                this.setState({ courses: res.results, loading: false })
            }
        } catch (error) {
            console.log(error)
            this.setState({ courses: [], loading: false })
        }
    }
}
export default Course;
