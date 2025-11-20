/**
 * QuizScreen Component (Phase 5 - Tier 4)
 * Take quiz/assessment
 * Adapted from EducatePro template
 *
 * Features:
 * - Multiple choice questions
 * - Progress tracking
 * - Timer
 * - Submit answers
 * - Results display
 * - Dark mode support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/educatepro-theme';
import { Button } from '../../components/EducatePro';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

interface QuizScreenProps {
  navigation: any;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What is React?',
    options: [
      'A JavaScript library for building user interfaces',
      'A backend framework',
      'A database management tool',
      'A CSS preprocessor',
    ],
    correct: 0,
  },
  {
    id: '2',
    question: 'What is JSX?',
    options: [
      'Java Standard Extension',
      'JavaScript XML - syntax extension for JavaScript',
      'JSON Extra',
      'JavaScript Xml Parser',
    ],
    correct: 1,
  },
  {
    id: '3',
    question: 'What is a component in React?',
    options: [
      'A JavaScript file',
      'A reusable piece of UI',
      'A CSS class',
      'A database table',
    ],
    correct: 1,
  },
];

const QuizScreen = ({ navigation }: QuizScreenProps) => {
  const [isDark] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  /**
   * Calculate score
   */
  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === QUIZ_QUESTIONS[index].correct) {
        correct++;
      }
    });
    return (correct / QUIZ_QUESTIONS.length) * 100;
  };

  /**
   * Handle answer selection
   */
  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  /**
   * Handle next question
   */
  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  /**
   * Handle submit quiz
   */
  const handleSubmitQuiz = () => {
    if (selectedAnswers.some((ans) => ans === null)) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting');
      return;
    }
    setShowResults(true);
  };

  /**
   * Format time
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /**
   * Render header
   */
  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
          borderBottomColor: isDark ? COLORS.dark2 : COLORS.greyscale200,
        },
      ]}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={isDark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.headerTitle,
          {
            color: isDark ? COLORS.white : COLORS.black,
          },
        ]}
      >
        React Fundamentals Quiz
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );

  /**
   * Render results
   */
  const renderResults = () => {
    const score = calculateScore();

    return (
      <View style={styles.resultsContainer}>
        <View
          style={[
            styles.scoreDisplay,
            {
              backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="trophy"
            size={48}
            color={COLORS.primary}
          />

          <Text
            style={[
              styles.scoreText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Your Score
          </Text>

          <Text style={styles.scoreValue}>{Math.round(score)}%</Text>

          <Text
            style={[
              styles.scoreMessage,
              {
                color:
                  score >= 80
                    ? COLORS.primary
                    : score >= 60
                    ? '#FF9800'
                    : COLORS.red,
              },
            ]}
          >
            {score >= 80
              ? 'Excellent!'
              : score >= 60
              ? 'Good Job!'
              : 'Try Again'}
          </Text>
        </View>

        <View style={styles.resultDetails}>
          <Text
            style={[
              styles.detailsTitle,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Results
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color: isDark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Total Questions: {QUIZ_QUESTIONS.length}
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color: COLORS.primary,
              },
            ]}
          >
            Correct: {selectedAnswers.filter((ans, idx) => ans === QUIZ_QUESTIONS[idx].correct).length}
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color: COLORS.red,
              },
            ]}
          >
            Incorrect:{' '}
            {selectedAnswers.filter((ans, idx) => ans !== QUIZ_QUESTIONS[idx].correct).length}
          </Text>
        </View>

        <Button
          title="Back to Lesson"
          onPress={() => navigation.goBack()}
          filled
          style={{ marginTop: SIZES.padding * 2 }}
        />
      </View>
    );
  };

  /**
   * Render quiz
   */
  const renderQuiz = () => {
    const question = QUIZ_QUESTIONS[currentQuestion];

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.quizContainer}>
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </Text>
          </View>

          <View
            style={[
              styles.questionCard,
              {
                backgroundColor: isDark ? COLORS.dark2 : COLORS.greyscale50,
              },
            ]}
          >
            <Text
              style={[
                styles.questionText,
                {
                  color: isDark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              {question.question}
            </Text>

            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAnswer(index)}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      selectedAnswers[currentQuestion] === index
                        ? COLORS.primary
                        : isDark
                        ? COLORS.dark3
                        : COLORS.white,
                    borderColor:
                      selectedAnswers[currentQuestion] === index
                        ? COLORS.primary
                        : COLORS.greyscale200,
                  },
                ]}
              >
                <View
                  style={[
                    styles.optionRadio,
                    {
                      borderColor:
                        selectedAnswers[currentQuestion] === index
                          ? COLORS.white
                          : COLORS.greyscale300,
                    },
                  ]}
                >
                  {selectedAnswers[currentQuestion] === index && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: COLORS.white },
                      ]}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        selectedAnswers[currentQuestion] === index
                          ? COLORS.white
                          : isDark
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.navigationButtons}>
            {currentQuestion > 0 && (
              <Button
                title="Previous"
                onPress={() => setCurrentQuestion(currentQuestion - 1)}
                filled={false}
                color={COLORS.greyscale200}
                textColor={isDark ? COLORS.white : COLORS.black}
                style={{ flex: 1, marginRight: SIZES.padding2 }}
              />
            )}

            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
              <Button
                title="Next"
                onPress={handleNextQuestion}
                filled
                style={{ flex: 1 }}
              />
            ) : (
              <Button
                title="Submit Quiz"
                onPress={handleSubmitQuiz}
                filled
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      {renderHeader()}
      {showResults ? renderResults() : renderQuiz()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  quizContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  progressSection: {
    marginBottom: SIZES.padding * 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.greyscale200,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SIZES.padding2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionCard: {
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SIZES.padding * 1.5,
    lineHeight: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: 12,
    marginBottom: SIZES.padding,
    borderWidth: 1.5,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: SIZES.padding2,
  },
  resultsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  scoreDisplay: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: SIZES.padding2,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SIZES.padding,
  },
  scoreMessage: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultDetails: {
    padding: SIZES.padding2,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    marginBottom: SIZES.padding * 2,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SIZES.padding,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
});

export default QuizScreen;
