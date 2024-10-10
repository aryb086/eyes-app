import 'package:flutter/material.dart';
import 'mainpage.dart';

class Home extends StatelessWidget {
  const Home({super.key});

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
      title: const Text("Post",
          style: TextStyle(
              color: Colors.black,
              fontSize: 30,
              fontWeight: FontWeight.bold,
              fontStyle: FontStyle.italic)),
      centerTitle: true,
    );
  }

  _body(context){
    return const Text('hello');
  }
}
