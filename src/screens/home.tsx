import React from 'react';
import { Header, Statistic, Icon, Modal, Image, Button, Label } from 'semantic-ui-react';
import coc from "../assets/images/college of commerce.jpg"
import coam from "../assets/images/college of arts and music.jpg"
import coa from "../assets/images/college of architecture.jpg"
import './shared-styles.scss';

const defaultState = { open: false }
class Home extends React.Component {
  state = { ...defaultState }
  render() {
    return <div className="page">
      <Header as='h1'>Welcome back! John</Header>
      <Statistic.Group widths='three' className="statistic-data">
        <Statistic onClick={this.toggleModal.bind(this)}>
          <Statistic.Value>3</Statistic.Value>
          <Statistic.Label>Signups</Statistic.Label>
          <a>View More</a>
        </Statistic>

        <Statistic onClick={this.handleClick.bind(this, "college")}>
          <Statistic.Value>
            <Icon name='university' />50
      </Statistic.Value>
          <Statistic.Label>Colleges</Statistic.Label>
          <a>View More</a>
        </Statistic>

        <Statistic onClick={this.handleClick.bind(this, "teacher")}>
          <Statistic.Value>
            <Icon name='users' />420
      </Statistic.Value>
          <Statistic.Label>Teachers</Statistic.Label>
          <a>View More</a>
        </Statistic>
      </Statistic.Group>

      <Modal
        open={this.state.open}
      >
        <Modal.Header>New Signups</Modal.Header>
        <Modal.Content scrolling>
          <div className="image-content">
            <Image size='medium' src={coc} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>College Of Commerce</Header>
                <Label color="yellow">Approval pending</Label>
              </div>
              <p>
                Offering Online Education Since 2010, We were founded in 1905, and have long had a commitment to reaching our students anywhere they are. And while our beautiful campus is in the foothills of western Carolina, our students are all around the globe.
          </p>
            </Modal.Description>
          </div>
          <div className="image-content">
            <Image size='medium' src={coam} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>College Of Music</Header>
                <Label color="yellow">Approval pending</Label>
              </div>
              <p>
                As the largest provider of worldwide music education, we help you take your music career to the next level through our award-winning courses, certificates, bachelor’s, and master’s degree programs.
          </p>
            </Modal.Description>
          </div>
          <div className="image-content">
            <Image size='medium' src={coa} />
            <Modal.Description>
              <div className="header-wrapper">
                <Header>College Of Architecture</Header>
                <Label color="olive">Approval Processing</Label>
              </div>
              <p>
                College Of Architecture is uniquely structured as a two plus three stackable credential, awarding a technical Associate of Applied Science degree after the first two years and a comprehensive professional Bachelor of Architecture (B.Arch.) degree after the final three years. This structure allows students from other technical and community colleges to seamlessly transfer into year three program...
          </p>
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
    </div>
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
