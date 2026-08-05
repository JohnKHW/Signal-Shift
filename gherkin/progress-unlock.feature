@p1 @progress
Feature: Lightweight Progress & Unlock
  As a player
  I want to see which Signal Types I have learned in this session
  So that I feel a sense of growth without needing an account

  Scenario: Signals start locked in the progress panel
    Given a new play session begins
    Then all five Signal Type entries in the progress panel appear locked (grey or “?”)

  Scenario: Correct classification unlocks a signal
    Given the player is in the Tutorial or a regular level
    When the player correctly classifies a Signal Type for the first time
    Then that Signal Type becomes unlocked and stays lit for the rest of the session

  Scenario: Locked progress entries do not reveal detailed meaning
    Given a Signal Type is still locked
    Then its progress entry hides its detailed meaning
    And its classification control still exposes the category name and distinct icon

  Scenario: Pattern Summary shows learning patterns
    Given the player has completed the Transfer Check
    When the Pattern Summary appears
    Then it lists Signal Types unlocked in the session
    And it highlights the most frequently confused Signal Type or boundary, if any
    And it reports the Transfer Check result
    And it shows a supportive next-practice suggestion
    And it does not show a single pass-or-fail overall grade

  Scenario: Ordinary gameplay does not persist personal results
    Given the player completes a session
    When the player starts a new session or refreshes the page
    Then prior progress and results are not available
    And no account or identifiable data is required
