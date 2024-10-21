import 'package:flutter/material.dart';
import 'mainpage.dart';

class Posts extends StatelessWidget {
  const Posts({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.all(24),
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
      leadingWidth: 130,
      titleSpacing: 0,
      leading: Padding(
        padding: const EdgeInsets.only(left: 0.0),
        child: IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const MainPage()),
              );
            },
            icon: Image.asset(
              'assets/eyes_logo.png',
              width: 100,
              height: 100,
            )),
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

  _body(context) {
    return IconButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const MainPage()),
          );
        },
        icon: Image.asset(
          'assets/eyes_logo.png',
          width: 24,
          height: 24,
        ));
  }
}
