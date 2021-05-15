import React from 'react';
import { List, Breadcrumb, Header } from 'semantic-ui-react';
import './shared-styles.scss';

const defaultState = { Teachers: [], loading: true, listLoading: false, }
class Teacher extends React.Component {
  state = { ...defaultState }

  render() {
    const sections = [
      { key: 'Home', content: 'Home', link: true, href: "/" },
      { key: 'Teachers', content: 'Teachers', active: true }
    ]
    return <div className="page">
      <Breadcrumb icon='right angle' sections={sections} />

      <Header as='h1'>Teachers</Header>
      <List divided relaxed className="list-data">
        <List.Item className="list-heading">
          <List.Content>
            <List.Header>Name</List.Header>
          </List.Content>

          <List.Content>
            <List.Header>Course</List.Header>
          </List.Content>

          <List.Content>
            <List.Header>Students</List.Header>
          </List.Content>

          <List.Content>
            <List.Header>Averege Marks</List.Header>
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Content> </List.Content>

          <List.Content> </List.Content>

          <List.Content> </List.Content>

          <List.Content> </List.Content>
        </List.Item>
      </List>
    </div>
  }
}
export default Teacher;
