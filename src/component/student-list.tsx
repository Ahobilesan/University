import React from 'react';
import { List, Dropdown, Loader } from 'semantic-ui-react';
import { getVisibleDate } from "../assets/util"
import '../screens/shared-styles.scss';

class Students extends React.Component<any> {
    render() {
        return <div className="component">
            <List divided relaxed className="list-data">
                <List.Item className="list-heading">
                    <List.Content>
                        <List.Header as="h3">Student</List.Header>
                    </List.Content>
                    <List.Content>
                        <List.Header as="h3">Grades</List.Header>
                    </List.Content>
                </List.Item>

                {!this.props.loading && this.props.students.map((e: any, i: number) => {
                    return <List.Item key={i}>
                        <List.Content>
                            <div className="details">
                                <Dropdown compact trigger={<span >{e.firstName} {e.lastName}</span>} options={[
                                    { key: 'Edit', text: 'Edit', onClick: this.editStudent.bind(this, e) },
                                    { key: 'Delete', text: 'Delete', onClick: this.deleteStudent.bind(this, e) },
                                ]} /></div>
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

                {!this.props.loading && this.props.students.length === 0 && <List.Item className="empty-list"><List.Content> No Items Found  </List.Content></List.Item>}
                {this.props.loading && <List.Item className="empty-list"><Loader active inline="centered"></Loader></List.Item>}
            </List>
        </div>
    }

    editStudent(e: any, _: any) {
        if (this.props && this.props.onEdit) {
            this.props.onEdit(_, e)
        }
    }
    deleteStudent(e: any, _: any) {
        if (this.props && this.props.onDelete) {
            this.props.onDelete(_, e)
        }
    }
}
export default Students;
