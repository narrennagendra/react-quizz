import { createContext, useContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;

const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    secondsRemaining: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return { ...state, questions: action.payload, status: "ready" };
        case "dataFailed":
            return { ...state, status: "error" };
        case "start":
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECS_PER_QUESTION,
            };
        case "newAnswer":
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? question.points + state.points
                        : state.points,
            };
        case "nextQuestion":
            return { ...state, index: state.index + 1, answer: null };
        case "finish":
            return {
                ...state,
                status: "finished",
            };
        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining <= 0 ? "finished" : state.status,
            };
        default:
            throw new Error("Action Unknown");
    }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

    useEffect(function () {
        async function fetchQuestions() {
            try {
                const res = await fetch("http://localhost:8000/api",{
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                console.log(data);
                dispatch({ type: "dataReceived", payload: data.data.questions });
            } catch (err) {
                dispatch({ type: "dataFailed" });
            }
        }
        fetchQuestions();
    }, []);

    return (
        <QuizContext.Provider
            value={{
                questions,
                status,
                index,
                answer,
                points,
                secondsRemaining,
                numQuestions,
                maxPossiblePoints,

                dispatch,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined)
        throw new Error("CitiesContext was used outside the CitiesProvider");
    return context;
}

export { QuizProvider, useQuiz };
