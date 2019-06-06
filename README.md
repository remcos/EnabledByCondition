# Documentation

## Description
This widget allows you to only enable buttons when a certain condition is met. This condition can be checked with a microflow or nanoflow. From now on, there's no need to surprise users with appearing and dissapearing buttons anymore!

## Typical usage scenario
*	Enable a button only when the status of the context object is appropriate.
*	Enable a button based based on complex conditions (such as counts).
*	Enable a button based on the status of a related object.

## Features and limitations
*	Enable or disable one or more buttons based on a boolean value resulting from any Microflow or Nanoflow.
*	Rerun the logic when the context is refreshed, so that a button can be disabled/enabled without leaving the page.

## Configuration
1.	Create a microflow or nanoflow that has the Context Entity as input parameter.
2.	End the flow with a boolean value, which determines whether the button(s) should be enabled (true) or not (false).
3.	Give the button(s) a class and input that class name into the widget.
4.	Select the created micro- or nanoflow in the widget.
