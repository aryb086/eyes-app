import 'package:congressional_app/features/authentication/screens/login.dart';
import 'package:congressional_app/utils/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'data/repositories/firebase_options.dart';
import 'package:congressional_app/utils/theme/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  EColors.linearGradient;
  runApp(MaterialApp(
    themeMode: ThemeMode.system,
    theme: EAppTheme.light,
    darkTheme: EAppTheme.dark,
    title: 'Eyes',
    home: const LoginPage(),
  ));
}



