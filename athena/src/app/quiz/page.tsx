import QuizPage from '../../(components)/QuizPage/index'; // Assuming your index.js file contains the QuizPage component
import questionsData from '../../(components)/QuizPage/questions.json';

export default function Quiz() {
    return <QuizPage questionsData={questionsData} />;
}
