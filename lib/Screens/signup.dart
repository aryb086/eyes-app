import 'package:congressional_app/classes/user_info.dart';
import 'package:congressional_app/globals.dart' as globals;
import 'package:flutter/material.dart';
import 'login.dart';
import 'mainpage.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final nameInput = TextEditingController();
  final emailInput = TextEditingController();
  final userInput = TextEditingController();
  final passwordInput = TextEditingController();
  final confirmPasswordInput = TextEditingController();
  var name = '';
  var email = '';
  var user = '';
  var password = '';
  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    nameInput.dispose();
    userInput.dispose();
    passwordInput.dispose();
    confirmPasswordInput.dispose();
    emailInput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Container(
          margin: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              _header(context),
              const SizedBox(
                height: 50,
              ),
              _inputField(context),
              _logIn(context),
            ],
          ),
        ),
      ),
    );
  }

  _header(context) {
    return AppBar(
      leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          }),
      title: const Text('Sign Up',
          style: TextStyle(
              color: Colors.black, fontSize: 30, fontWeight: FontWeight.bold)),
      centerTitle: true,
    );
  }

  _inputField(context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          controller: nameInput,
          decoration: InputDecoration(
              hintText: "Name",
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none),
              fillColor: Colors.black.withOpacity(0.1),
              filled: true,
              prefixIcon: const Icon(Icons.account_box)),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: emailInput,
          decoration: InputDecoration(
              hintText: "Email",
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none),
              fillColor: Colors.black.withOpacity(0.1),
              filled: true,
              prefixIcon: const Icon(Icons.email)),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: userInput,
          decoration: InputDecoration(
              hintText: "Username",
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none),
              fillColor: Colors.black.withOpacity(0.1),
              filled: true,
              prefixIcon: const Icon(Icons.person)),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: passwordInput,
          decoration: InputDecoration(
            hintText: "Password",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
            prefixIcon: const Icon(Icons.password),
          ),
          obscureText: true,
        ),
        const SizedBox(
          height: 10,
        ),
        TextField(
          controller: confirmPasswordInput,
          decoration: InputDecoration(
              hintText: "Confirm Password",
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none),
              fillColor: Colors.black.withOpacity(0.1),
              filled: true,
              prefixIcon: const Icon(Icons.password)),
          obscureText: true,
        ),
        const SizedBox(height: 50),
        ElevatedButton(
          onPressed: () {
            _signupLogic(context);
          },
          style: ElevatedButton.styleFrom(
            shape: const StadiumBorder(),
            padding: const EdgeInsets.symmetric(vertical: 16),
            backgroundColor: Colors.black,
          ),
          child: const Text(
            "Sign Up",
            style: TextStyle(fontSize: 20, color: Colors.white),
          ),
        )
      ],
    );
  }

  _logIn(context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text("Have an account? "),
        TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              );
            },
            child: const Text(
              "Log In",
              style: TextStyle(color: Colors.black),
            ))
      ],
    );
  }

  _signupLogic(context) {
    if (passwordInput.text == confirmPasswordInput.text) {
      if (nameInput.text.isNotEmpty &&
          passwordInput.text.isNotEmpty &&
          emailInput.text.isNotEmpty &&
          userInput.text.isNotEmpty) {
        setState(() {
          name = nameInput.text;
          email = emailInput.text;
          user = userInput.text;
          password = passwordInput.text;
          var userInfo = UserInfo(name, email, user, password);
          globals.users.add(userInfo);
          for (int i = 0; i < globals.users.length; i++) {}
        });
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const MainPage()),
        );
      }
    } else {
      passwordInput.clear();
      confirmPasswordInput.clear();
    }
  }
}
