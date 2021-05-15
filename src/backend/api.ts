// Imports 
import course from "./local/course"
import teacher from "./local/teacher"
import student from "./local/student"
import statistics from "./local/statistics"

// export API
export default process.env.NODE_ENV === "production" ? {/*Production API will be added here */ } : { statistics, course, teacher, student }
