import 'package:congressional_app/utils/theme/custom_theme/elevated_button_theme.dart';
import 'package:flutter/material.dart';
import 'custom_theme/text_theme.dart';
import 'custom_theme/app_bar_theme.dart';
import 'custom_theme/bottom_sheet_theme.dart';
import 'custom_theme/checkbox_theme.dart';
import 'custom_theme/chip_theme.dart';
import 'custom_theme/outlined_button_theme.dart';
import 'custom_theme/text_field_theme.dart';

class EAppTheme{
  EAppTheme._();
  static ThemeData light = ThemeData(
    useMaterial3: true,
    fontFamily: 'Poppins',
    brightness: Brightness.light,
    primaryColor: Colors.blue,
    scaffoldBackgroundColor: Colors.white,
    textTheme: ETextTheme.lightTextTheme,
    elevatedButtonTheme: E_ElevatedButtonTheme.lightElevatedButtonTheme,
    appBarTheme: EAppBarTheme.lightAppBarTheme,
    bottomSheetTheme: EBottomSheetTheme.lightBottomSheetTheme,
    checkboxTheme: ECheckboxTheme.lightCheckboxTheme,
    chipTheme: EChipTheme.lightChipTheme,
    outlinedButtonTheme: EOutlinedButtonTheme.lightOutlinedButtonTheme,
    inputDecorationTheme: ETextFormFieldTheme.lightInputDecorationTheme
  );
  static ThemeData dark = ThemeData(
    useMaterial3: true,
    fontFamily: 'Poppins',
    brightness: Brightness.dark,
    primaryColor: Colors.blue,
    scaffoldBackgroundColor: Colors.black,
    textTheme: ETextTheme.darkTextTheme,
    elevatedButtonTheme: E_ElevatedButtonTheme.darkElevatedButtonTheme,
    appBarTheme: EAppBarTheme.darkAppBarTheme,
    bottomSheetTheme: EBottomSheetTheme.darkBottomSheetTheme,
    checkboxTheme: ECheckboxTheme.darkCheckboxTheme,
    chipTheme: EChipTheme.darkChipTheme,
    outlinedButtonTheme: EOutlinedButtonTheme.darkOutlinedButtonTheme,
    inputDecorationTheme: ETextFormFieldTheme.darkInputDecorationTheme
  );  
}