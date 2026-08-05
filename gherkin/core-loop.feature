@p0 @core @gameplay
Feature: Core Decision Loop
  As a player
  I want a clear sequence of classify → Confirm/Respond → receive feedback
  So that I can practise a useful action without being judged for making a mistake

  Scenario: Complete happy path for one scenario
    Given the player is on Level 2 (Boss Vague Feedback)
    When the player classifies the signal as Yellow Light
    And selects the preferred Confirmation Response
    Then qualitative Relationship feedback says the situation improved
    And qualitative Stress feedback says the situation improved or stayed stable
    And qualitative Performance feedback says the situation improved
    And supportive coaching explains how the response created clarity
    And a "Next" control is available

  Scenario: Another acceptable response remains a learning success
    Given the player has classified the signal
    When the player selects an acceptable response
    Then the system shows context-appropriate qualitative impact feedback
    And coaching explains the trade-off without calling the player wrong
    And the player can continue to the next scenario

  Scenario: Harmful response produces a recoverable consequence
    Given the player has classified the signal
    When the player selects a harmful response
    Then the relevant Impact Meters show a clear negative change
    And coaching explains a safer or more useful alternative
    And no Game Over occurs
    And the player can continue to the next scenario

  Scenario: Safety takes priority over short-term performance
    Given the player is in a Red Light scenario
    When the player selects a Safety Response
    Then the coaching says that safety and agency take priority
    And the response is not downgraded solely because short-term relationship or performance may fall
