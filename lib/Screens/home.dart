import 'package:congressional_app/Screens/join_city.dart';
import 'package:congressional_app/Screens/join_nh.dart';
import 'package:flutter/material.dart';
import 'package:congressional_app/globals.dart' as globals;

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          _header(context),
          const SizedBox(
            height: 20,
          ),
          _body(context),
        ],
      ),
    );
  }

  _header(context) {
    return AppBar(
      leadingWidth: 70,
      titleSpacing: 0,
      title: const Text("Eyes",
          style: TextStyle(
              color: Colors.black,
              fontSize: 30,
              fontWeight: FontWeight.bold,
              fontStyle: FontStyle.italic)),
      centerTitle: false,
    );
  }

  _body(context) {
    if (globals.users[globals.username]!.citySetup == false) {
      if (globals.users[globals.username]!.neighborhoodSetup == false) {
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
                    "To Do: Join your city",
                    style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        fontSize: 20),
                  )),
              TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const JoinNeighborhood()),
                    );
                  },
                  child: const Text(
                    "Join your neighborhood",
                    style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        fontSize: 20),
                  ))
            ],
          ),
        );
      }
    } else if (globals.users[globals.username]!.citySetup == false) {
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
                  "To Do: Join your city",
                  style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                )),
          ],
        ),
      );
    } else if (globals.users[globals.username]!.neighborhoodSetup == false) {
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
                    MaterialPageRoute(
                        builder: (context) => const JoinNeighborhood()),
                  );
                },
                child: const Text(
                  "To Do: Join your neighborhood",
                  style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 20),
                ))
          ],
        ),
      );
    } else {
      return const Text('hello');
    }
  }
}
