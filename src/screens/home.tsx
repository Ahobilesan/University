import React from 'react';
import { Header, Statistic, Icon, Modal, Image, Button, Label, Loader } from 'semantic-ui-react';
import matthew from "../assets/images/matthew.svg"
import lindsay from "../assets/images/lindsay.svg"
import rachel from "../assets/images/rachel.svg"
import api from "../backend/api"
import './shared-styles.scss';

const defaultState = { students: 0, teachers: 0, courses: 0, open: false, loading: true }
class Home extends React.Component {
  state = { ...defaultState }
  render() {
    return <div className="component-page">
      {!this.state.loading && <div>
        <Header as='h1'>Welcome back! John</Header>
        <Statistic.Group widths='three' className="statistic-data">
          <Statistic onClick={this.toggleModal.bind(this)}>
            <Statistic.Value>3</Statistic.Value>
            <Statistic.Label>Signups</Statistic.Label>
            <span className="link-text">View More</span>
          </Statistic>

          <Statistic onClick={this.handleClick.bind(this, "courses")}>
            <Statistic.Value>
              <Icon name='book' />{this.state.courses}
            </Statistic.Value>
            <Statistic.Label>Courses</Statistic.Label>
            <span className="link-text">View More</span>
          </Statistic>

          <Statistic onClick={this.handleClick.bind(this, "student")}>
            <Statistic.Value>
              <Icon name='users' />{this.state.students}
            </Statistic.Value>
            <Statistic.Label>Students</Statistic.Label>
            <span className="link-text">View More</span>
          </Statistic>
        </Statistic.Group>
      </div>}
      <Modal
        open={this.state.open}
      >
        <Modal.Header>New Signups</Modal.Header>
        <Modal.Content scrolling>
          <div className="image-content">
            <Image size='medium' src={matthew} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>Matthew</Header>
                <Label color="yellow">Approval pending</Label>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </Modal.Description>
          </div>
          <div className="image-content">
            <Image size='medium' src={lindsay} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>Lindsay</Header>
                <Label color="yellow">Approval pending</Label>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </Modal.Description>
          </div>
          <div className="image-content">
            <Image size='medium' src={rachel} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>Rachel</Header>
                <Label color="olive">Approval Processing</Label>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </Modal.Description>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            content="Close"
            onClick={this.toggleModal.bind(this)}
          />
        </Modal.Actions>
      </Modal>

      {this.state.loading && <Loader active>Loading Home</Loader>}
    </div>
  }

  componentDidMount() {
    this.getStats()
  }

  async getStats() {
    try {
      let res: any = await api.statistics?.read()
      if (res!.error === false) {
        console.log(res)
        let { students, teachers, courses } = res.result;
        this.setState({ students, teachers, courses, loading: false })
      }
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  toggleModal() {
    this.setState((prevState: any) => ({ open: !prevState.open }))
  }

  handleClick(page: string) {
    if (page)
      window.location.pathname = page
  }
}
export default Home;
