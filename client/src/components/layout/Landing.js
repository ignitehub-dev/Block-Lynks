import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4 text-info">
                  What is Block Lynks
                </h1>
                <h2 className="text-muted text-left">
                  Block Lynks is a platform where users can create and
                  distribute their own cryptocurrency.
                </h2>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4 text-info">
                  How does Block Lynks work?
                </h1>
                <h2 className="text-muted">Signup for a free account today!</h2>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4 text-info">Want to learn more about Block Lynks?</h1>
                <h2 className="text-muted">Signup for a free account today!</h2>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
