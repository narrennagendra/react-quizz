import { useQuiz } from "../context/QuizContext";

function FinishScreen() {
    const { points, maxPossiblePoints } = useQuiz();

    const precentage = (points / maxPossiblePoints) * 100;

    let emoji;
    if (precentage === 100) emoji = "🥇";
    else if (precentage >= 80) emoji = "🎉";
    else if (precentage >= 50) emoji = "😄";
    else if (precentage >= 50) emoji = "🤔";
    else emoji = "🤦";

    return (
        <>
            <p className="result">
                <span>{emoji}</span>You scored <strong>{points}</strong> out of{" "}
                {maxPossiblePoints} ({Math.ceil(precentage)}%)
            </p>
        </>
    );
}

export default FinishScreen;
