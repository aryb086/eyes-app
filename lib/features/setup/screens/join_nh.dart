import 'package:congressional_app/features/setup/screens/create_neighborhood.dart';
import 'package:congressional_app/features/setup/screens/join_city.dart';
import 'package:congressional_app/features/feed/screens/mainpage.dart';
import 'package:flutter/material.dart';
import 'package:congressional_app/common/globals.dart' as global;

class JoinNeighborhood extends StatefulWidget {
  const JoinNeighborhood({super.key});

  @override
  State<JoinNeighborhood> createState() => _JoinNeighborhoodState();
}

class _JoinNeighborhoodState extends State<JoinNeighborhood> {
  final cityInput = TextEditingController();
  final zipInput = TextEditingController();
  final neighborhoodInput = TextEditingController();
  bool ifButtonPressed = false;
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
                  const SizedBox(
                    height: 30,
                  ),
                  Builder(
                    builder: (context) {
                      if (ifButtonPressed) {
                        return _findCityLogic(context);
                      }
                      return const SizedBox();
                    },
                  ),
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
      title: const Text("Neighborhood Setup",
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
          controller: neighborhoodInput,
          decoration: InputDecoration(
            hintText: "Neighborhood Name",
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
          controller: cityInput,
          decoration: InputDecoration(
            hintText: "City Name",
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
          controller: zipInput,
          decoration: InputDecoration(
            hintText: "Zip",
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
        ),
        const SizedBox(height: 50),
        ElevatedButton(
          onPressed: () {
            setState(() {
              ifButtonPressed = true;
            });
          },
          style: ElevatedButton.styleFrom(
            shape: const StadiumBorder(),
            padding: const EdgeInsets.symmetric(vertical: 16),
            backgroundColor: Colors.black,
          ),
          child: const Text(
            "Find Neighborhood",
            style: TextStyle(fontSize: 20, color: Colors.white),
          ),
        )
      ],
    );
  }
  _findCityLogic(context) {
    if (global.neighborhoods[neighborhoodInput.text]?.getZip() == zipInput.text) {
      global.users[global.email]!.neighborhoodSetup = true;
      return Container(
        decoration: const BoxDecoration(
            borderRadius: BorderRadius.all(Radius.circular(20)),
            color: Colors.white,
            border: Border(
                top: BorderSide(color: Colors.black),
                bottom: BorderSide(color: Colors.black),
                left: BorderSide(color: Colors.black),
                right: BorderSide(color: Colors.black))),
        height: 100,
        width: 300,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const JoinCity()),
                  );
                },
                child: const Text(
                  "{}", 
                  style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                )),
            TextButton(
                onPressed: () {},
                child: const Text(
                  "Create a page for your city",
                  style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                ))
          ],
        ),
      );
    } else {
      
        return Container(
        decoration: const BoxDecoration(
            borderRadius: BorderRadius.all(Radius.circular(20)),
            color: Colors.white,
            border: Border(
                top: BorderSide(color: Colors.black),
                bottom: BorderSide(color: Colors.black),
                left: BorderSide(color: Colors.black),
                right: BorderSide(color: Colors.black))),
        height: 100,
        width: 350,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const CreateNeighborhood()),
                  );
                },
                child: const Text(
                  "Can't find your neighborhood?",
                  style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                )),
          ],
        ),
      );
    }
  }
}