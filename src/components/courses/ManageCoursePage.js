import React, {useEffect, useState} from "react";
import { connect} from 'react-redux';
import propTypes, { func } from 'prop-types';
import {toast} from 'react-toastify';

import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import CourseForm from './CourseForm'
import { newCourse } from '../../../tools/mockData'
import { saveCourse } from "../../api/courseApi";

function ManageCoursePage({courses, authors, loadAuthors, loadCourses, saveCourse, history, ...props}) {
  const [course, setCourse] = useState({...props.course})
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if(courses.length ==0){
      loadCourses().catch(error => {
        alert('loading courses failed' + error)
      })
    }else{
      setCourse({...props.course})
    }
  
    if(authors ==0){
      loadAuthors().catch(error => {
        alert('loading authors failed' + error)
      })
    }
  }, [props.course]);

  function handleChange(event) {
    const {name, value} = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value,10) : value
    }))
  }

  function formIsValid() {
    const {title, authorId, category} = course;
    const errors = {}
    if(!title) errors.title = 'Title is required';
    if(!authorId) errors.author = 'Author is required';
    if(!category) errors.category = 'Category is required';
    setErrors(errors);
    // Form is valid if it have no props
    return Object.keys(errors).length === 0;
  }

  function handleSave(event){
    event.preventDefault();
    if(!formIsValid()) return;
    setSaving(true);
    saveCourse(course).then(() => {
      toast.success('Course Saved.')
      history.push("/courses");
    }).catch(error => {
      setSaving(false);
      setErrors({onSave: error.message})
    });
  }
    return (
      <CourseForm course={course} errors={errors} authors={authors} onChange={handleChange} onSave={handleSave} saving={saving}/>
    );
}

ManageCoursePage.propTypes ={
  loadCourses: propTypes.func.isRequired,
  loadAuthors: propTypes.func.isRequired,
  saveCourse: propTypes.func.isRequired,
  courses: propTypes.array.isRequired,
  course: propTypes.object.isRequired,
  history: propTypes.object.isRequired
}

export function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}
function mapStateToProps(state, ownProps) {
  const slug= ownProps.match.params.slug;
  debugger
  const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : newCourse
  return {
    course,
    courses: state.courses,
    authors: state.authors,
  };
}

const mapDispatchToProps ={
      loadCourses: courseActions.loadCourses,
      loadAuthors: authorActions.loadAuthors,
      saveCourse: courseActions.saveCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);//connect our component to redux
