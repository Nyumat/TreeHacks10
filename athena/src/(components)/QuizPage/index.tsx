"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CardHeader, CardContent, Card } from "@/(components)/ui/card"
import { Button } from "@/(components)/ui/button"

interface Question {
    question: string;
    choices: { choice: string; isCorrect: boolean }[];
}

interface QuizPageProps {
    questionsData: { [key: string]: string[] };
}

const QuizPage: React.FC<QuizPageProps> = ({ questionsData }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [results, setResults] = useState<boolean[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

    useEffect(() => {
        // Shuffle the choices for each question while marking the correct answer
        const shuffled = Object.entries(questionsData).map(([question, choices]) => {
            const correctAnswer = choices[0];
            const shuffledChoices = shuffleArray(choices);
            const choicesWithIsCorrect = shuffledChoices.map(choice => ({
                choice,
                isCorrect: choice === correctAnswer
            }));
            return { question, choices: choicesWithIsCorrect };
        });
        setShuffledQuestions(shuffled);
    }, [questionsData]);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = currentQuestion.choices.find(choice => choice.choice === selectedAnswer)?.isCorrect || false;
        setResults([...results, isCorrect]);
        setSelectedAnswer('');
        if (currentQuestionIndex + 1 < shuffledQuestions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    if (shuffledQuestions.length === 0) {
        return (
            <div className="flex flex-col h-screen">
                <main className="flex-1 bg-gray-100/30 dark:bg-gray-800/30">
                    <div className="h-full container flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center md:gap-10 md:px-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                No quiz could be made with that content
                            </h1>
                        </div>
                        <Link
                            className="inline-flex h-10 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                            href="/"
                        >
                            Back to Home
                        </Link>
                    </div>
                </main>
                <footer className="flex items-center justify-center h-16 text-sm border-t border-gray-200 border-gray-200 bg-white dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950">
                    © 2024 Athena. All rights reserved.
                </footer>
            </div>
        );
    }

    if (quizCompleted) {
        return <QuizResult results={results} />;
    }

    function BookOpenIcon(props: any) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        )
    }
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
        <div className="grid place-items-center h-[90vh]">
            <Card className="w-full max-w-md mx-auto">
                <div className="flex flex-col h-full">
                    <CardHeader className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="w-5 h-5 bg-gradient-to-tr from-cyan-600 to-light-blue-400 rounded-lg p-1.5 shadow-sm text-cool-gray-50 dark:from-cyan-400 dark:to-light-blue-200 dark:text-cool-gray-900" />
                            <div className="flex flex-col">
                                <h2 className="text-sm font-bold tracking-wide">Question {currentQuestionIndex + 1}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
                            </div>
                        </div>
                        <div className="h-1 min-w-0 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between gap-4 py-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">{currentQuestion.question}</h3>
                            <ul className="grid gap-4">
                                {currentQuestion.choices.map((choice, index) => (
                                    <li key={index}>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                className="rounded-full border-gray-200 w-4 h-4 border-gray-200 bg-gray-900 appearance-none dark:border-gray-800 dark:checked:bg-gray-50 dark:checked:border-gray-800 dark:checked:border-gray-800/50 checked:bg-gray-900 checked:border-gray-800/50 rounded-full checked:bg-green-500 dark:checked:bg-green-500"
                                                type="radio"
                                                value={choice.choice}
                                                checked={selectedAnswer === choice.choice}
                                                onChange={() => handleAnswerSelect(choice.choice)}
                                                name="answer"
                                            />
                                            <span className="text-sm font-medium">{choice.choice}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={handleNextQuestion}
                            className="mt-4 h-10 rounded-lg border-gray-200 border-gray-200 border dark:border-gray-800 dark:border-gray-800"
                            variant="outline"
                        >
                            Next
                        </Button>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

// Helper function to shuffle array
function shuffleArray(array: any[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface QuizResultProps {
    results: boolean[];
}

const QuizResult: React.FC<QuizResultProps> = ({ results }) => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter((result) => result).length;
    const score = (correctAnswers / totalQuestions) * 100;

    return (
        <main
            key="1"
            className="flex flex-col items-center justify-center h-screen px-4 py-6 md:px-6 md:py-12 lg:py-16 space-y-20 gap-20"
        >
            <article className="prose prose-gray max-w-3xl mx-auto dark:prose-invert text-center space-y-10">
                <div className="space-y-2 not-prose">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Quiz Results</h1>
                    <p className="text-gray-500 dark:text-gray-400 space-y-8">You scored {correctAnswers} out of {totalQuestions}</p>
                </div>
                <p>Great job!</p>
                <Button size="sm" variant="outline">
                    <Link
                        href="/"
                    >
                        Back to Home
                    </Link>
                </Button>
                <nav className="flex justify-center gap-2" />
            </article>
        </main>
    );
};


export default QuizPage;

