@p0 @content
Feature: Level Content & Progression
  As a player
  I want a fixed sequence of carefully designed scenarios
  So that I experience progressive difficulty and clear learning

  Scenario: Tutorial teaches all five Signal Types
    Given the player starts a new Start Learning session
    When they enter the Tutorial level
    Then each of the five Signal Types is presented one by one
    And the player must correctly classify each before continuing
    And no Impact Meter changes occur during the Tutorial

  Scenario: Level order is fixed for Start Learning
    Given the player has completed the Tutorial
    Then the next level is always "Boss Vague Feedback"
    And after that "Colleague Joke"
    And after that "Sudden Plan Change"
    And after that one unseen Transfer Check occurs

  Scenario: Level 4 is the primary Demo Mode scenario
    Given the player enters Demo Mode
    Then the player can enter "Sudden Plan Change" without completing the Tutorial
    And the answer signal is hidden before classification
    And the scenario has one Primary Signal Type of "Detour Sign"
    And mild Yellow evidence may appear as a Supporting Cue
    And three distinct response options are presented after classification

  Scenario: Transfer Check practises a Red Light boundary
    Given the player has completed Level 4
    When the Transfer Check appears
    Then the workplace scene is new and not a replay of a taught script
    And the answer signal is hidden before classification
    And the Primary Signal Type is "Red Light"
    And the scene includes a boundary that was ignored or repeated
    And three response options are presented after classification

  Scenario: Demo Slice remains short
    Given the player enters Demo Mode
    Then the representative scenario, reveal, coaching, and summary can be completed in 60 to 90 seconds
