import React, { Suspense } from 'react';
import { Loader, Dropdown, Icon, Header } from 'semantic-ui-react';
import './App.scss';

const defaultState = { page: "", loading: true }
const pages: any = {
  college: React.lazy(() => import("./screens/college")),
  courses: React.lazy(() => import("./screens/course")),
  teacher: React.lazy(() => import("./screens/teacher")),
  student: React.lazy(() => import("./screens/student")),
  home: React.lazy(() => import("./screens/home")),
  404: React.lazy(() => import("./screens/404"))
}
let Page: any

class University extends React.Component {
  state = { ...defaultState }
  options = [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>John Melvin</strong>
        </span>
      ),
      disabled: true,
    },
    { key: 'sign-out', text: 'Sign Out' },
  ]


  render() {
    return <div className="university">
      {Page !== undefined && <div>
        <nav>
          <Header href="/" className="brand">College</Header>
          <div>
            <Dropdown item trigger={<Icon name='user' />} icon=""
              direction='left' options={this.options} />
          </div>
        </nav>
        <div className="screens">
          {this.state.page !== "404" && !this.state.loading && <Suspense fallback={<Loader active>Loading {this.state.page}</Loader>}>
            <Page />
          </Suspense>}
        </div>
        <footer></footer>
      </div>}
      {!Page && <Loader active>Loading</Loader>}
    </div>
  }

  componentDidMount() {
    this.router()
  }

  async router(_path_?: any) {
    let _path = window.location.pathname;
    let path = _path_ ? _path_ : _path.split("/")[1];
    if (path && path.length) {
      if (pages[path]) {
        Page = pages[path];
        this.state.page = path.substring(0, 1).toUpperCase() + path.substring(1, path.length);
      } else {
        if (path === "index.html") {
          Page = pages.home;
          this.state.page = "Home";
        } else {
          Page = "404";
          this.state.page = "404";
        }
      }
    } else {
      window.location.pathname = "home"
      Page = pages.home;
      this.state.page = "Home";
    }
    if (path)
      localStorage.setItem("path", path)
    this.state.loading = false;
    this.setState({ init: "" })
    this.forceUpdate()
  }
}
export default University;
