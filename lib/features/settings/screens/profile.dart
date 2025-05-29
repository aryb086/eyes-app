import 'package:flutter/material.dart';
import '../../feed/screens/mainpage.dart';

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
      leading: IconButton(
        onPressed: () {
          Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const MainPage()),
        );
        },
        icon: const Icon(Icons.close),
      ),
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
