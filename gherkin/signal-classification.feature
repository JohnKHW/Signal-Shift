@p0 @core @signal
Feature: Signal Classification
  As a player learning workplace communication
  I want to classify the practical signal in a situation
  So that I can choose a useful or protective next action

  Background:
    Given the player is in a non-tutorial level
    And a workplace scenario with Signal Evidence is displayed

  Rule: The answer is hidden until classification
    Scenario: Player must reason from evidence before responding
      When the scenario loads
      Then the Primary Signal Type name and answer icon are not displayed
      And the five Signal Type controls are enabled
      And response options are disabled

  Rule: Classification is mandatory before response
    Scenario: Correct classification reveals the signal and unlocks responses
      Given the Primary Signal Type for the scenario is "Yellow Light"
      When the player selects "Yellow Light"
      Then the system reveals "Yellow Light"
      And the system explains the action supported by the evidence
      And response options become enabled

    Scenario: Incorrect classification still allows learning and progress
      Given the Primary Signal Type for the scenario is "Yellow Light"
      When the player selects "Green Light"
      Then the system reveals that the Primary Signal Type is "Yellow Light"
      And the system records a Yellow Light confusion for the session
      And response options become enabled
      And a short corrective coaching message is shown

  Rule: Classification is action-oriented
    Scenario: Player is coached on the next useful action
      Given the scenario evidence does not state a priority area
      When the player classifies the situation as "Yellow Light"
      Then coaching explains that clarification is more useful than guessing the speaker's private intention

  Rule: One primary signal per decision
    Scenario: Supporting cues do not create a multi-select answer
      Given a scenario has a Primary Signal Type of "Detour Sign"
      And it also contains incomplete details as a Supporting Cue
      When the player submits a classification
      Then only one Signal Type is selected
      And coaching may explain the Supporting Cue
