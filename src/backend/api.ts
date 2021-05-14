// Imports 
import college from "./local/college"
import teacher from "./local/teacher"
import student from "./local/student"

// export API
export default process.env.NODE_ENV === "production" ? {/*Production API will be added here */ } : { college, teacher, student }
