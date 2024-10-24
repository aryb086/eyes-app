import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'mainpage.dart';

class CreateCity extends StatefulWidget {
  const CreateCity({super.key});

  @override
  State<CreateCity> createState() => _CreateCityState();
}

class _CreateCityState extends State<CreateCity> {
  final cityInput = TextEditingController();
  final zipInput = TextEditingController();
  final stateInput = TextEditingController();
  final countryInput = TextEditingController();
  bool ifButtonPressed = false;
  
  final User? currentUser = FirebaseAuth.instance.currentUser;

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    cityInput.dispose();
    zipInput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
          body: Container(
              margin: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _header(context),
                  const SizedBox(
                    height: 30,
                  ),
                  _body(context),
                ],
              ))),
    );
  }

  _header(context) {
    return AppBar(
      leading: Padding(
        padding: const EdgeInsets.only(left: 0.0, right: 0),
        child: IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const MainPage()),
              );
            },
            icon: const Icon(Icons.close)),
      ),
      title: const Text("Create a page for your city",
          style: TextStyle(
              color: Colors.black, fontSize: 20, fontStyle: FontStyle.italic)),
      centerTitle: true,
    );
  }

  _body(context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
          controller: cityInput,
          decoration: InputDecoration(
            hintText: "City Name",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
          controller: stateInput,
          decoration: InputDecoration(
            hintText: "State",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
          obscureText: false,
        ),
        const SizedBox(height: 10),
        TextField(
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
          controller: countryInput,
          decoration: InputDecoration(
            hintText: "Country",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
          obscureText: false,
        ),
        const SizedBox(height: 10),
        TextField(
          onTapOutside: (event) {
                  print('onTapOutside');
                    FocusManager.instance.primaryFocus?.unfocus();
                },
          controller: zipInput,
          decoration: InputDecoration(
            hintText: "Zip",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
          obscureText: false,
        ),
        const SizedBox(height: 50),
        ElevatedButton(
          onPressed: () {
            try{
              createCityDoc(cityInput.text, stateInput.text, countryInput.text, zipInput.text);
              FirebaseFirestore.instance.collection('UserData').doc(currentUser!.email).update({'city setup': true});
              FirebaseFirestore.instance.collection('UserData').doc(currentUser!.email).update({'city name': cityInput.text});
            // ignore: empty_catches
            }on FirebaseException{

            }
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const MainPage()),
            );
          },
          style: ElevatedButton.styleFrom(
            shape: const StadiumBorder(),
            padding: const EdgeInsets.symmetric(vertical: 16),
            backgroundColor: Colors.black,
          ),
          child: const Text(
            "Create City Page",
            style: TextStyle(fontSize: 20, color: Colors.white),
          ),
        )
      ],
    );
  }

  Future<void> createCityDoc(
      String city, String state, String country, String zip) async {
    await FirebaseFirestore.instance
        .collection('CityData')
        .doc(city)
        .set({
      'city': city,
      'state': state,
      'country': country,
      'zip': zip,
    });
  }
}
