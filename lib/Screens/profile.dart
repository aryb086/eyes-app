import 'package:flutter/material.dart';
import 'mainpage.dart';

class Profile extends StatelessWidget {
  const Profile({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          _header(context),
          _body(context),
        ],
      ),
    );
  }

  _header(context) {
    return AppBar(
      title: const Text("S E T T I N G S",
          style: TextStyle(
              color: Colors.black,
              fontSize: 30,)),
      centerTitle: true,
    );
  }

  _body(context){
    return const Text('hello');
  }
}
