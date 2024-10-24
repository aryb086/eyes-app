import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
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
          child: ListView(
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
    return const Column(
      children: [
        Icon(Icons.visibility, size: 80),
        SizedBox(
          height: 25,
        ),
        Text('E Y E S',
            style: TextStyle(
              color: Colors.black,
              fontSize: 20,
            )),
      ],
    );
  }

  _inputField(context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
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
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
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
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
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
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
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
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
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
            _signupLogic();
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

  void _signupLogic() async {
    if (passwordInput.text == confirmPasswordInput.text) {
      showDialog(
        context: context,
        builder: (context) => const Center(child: CircularProgressIndicator()));
      try {
        UserCredential? userCredential = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(email: emailInput.text, password: passwordInput.text);
        // ignore: use_build_context_synchronously
        Navigator.pop(context);
        createUserDoc(userCredential);
        // ignore: use_build_context_synchronously
        if (context.mounted) Navigator.pop(context);
      } on FirebaseAuthException {
        // ignore: use_build_context_synchronously
        Navigator.pop(context);
      }
      Navigator.push(
        // ignore: use_build_context_synchronously
        context,
        MaterialPageRoute(builder: (context) => const MainPage()),
      );
    } else {
      passwordInput.clear();
      confirmPasswordInput.clear();
    }
  }

  Future<void> createUserDoc(UserCredential? userCredential) async {
    if (userCredential != null && userCredential.user != null) {
      await FirebaseFirestore.instance
          .collection('UserData')
          .doc(userCredential.user!.email)
          .set({
        'name': nameInput.text,
        'email': userCredential.user!.email,
        'username': userInput.text,
        'neighborhood setup': false,
        'city setup': false,
        'city name': '',
        'neighborhood name': '',
      });
    }
  }
}
