import React from "react";
import { connect} from 'react-redux';
import propTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import CourseList from './CourseList'
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {

  state = {
    redirectToAddCoursePage: false
  }
  componentDidMount() {
    const {courses, authors, actions} = this.props;
    if(courses.length ==0){
      actions.loadCourses().catch(error => {
        alert('loading courses failed' + error)
      })
    }
  
    if(authors ==0){
      actions.loadAuthors().catch(error => {
        alert('loading authors failed' + error)
      })
    }
  }

  handleDeleteCourse = async course => {
    toast.success('Course Deleted');
    try {
      await this.props.actions.deleteCourse(course);
    } catch(error){
      toast.error('Delete failed. '+error.message, {autoClose: false})
    }
  }
  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner/>
        ) : (
          <div>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>
            <CourseList courses={this.props.courses} onDeleteClick = {this.handleDeleteCourse} />
          </div>
        )}
      </>
    );
  }
}

CoursesPage.propTypes ={
  actions: propTypes.object.isRequired,
  courses: propTypes.array.isRequired,
  loading: propTypes.bool.isRequired
}
function mapStateToProps(state, ownProps) {
  debugger
  return {
    courses:
      state.courses.length === 0 || state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId).name,
            };
          }),
    authors: state.authors.length === 0 ? [] : state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);//connect our component to redux
