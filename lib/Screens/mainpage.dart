import 'package:flutter/material.dart';
import 'posts.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _selectedIndex = 0;
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            IndexedStack(
              index: _selectedIndex,
              children: _pages,
            ),
          ],
        ),
        bottomNavigationBar: _footer(context),
      ),
    );
  }


  _footer(context) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
        BottomNavigationBarItem(icon: Icon(Icons.add), label: 'Post'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account')
      ],
      currentIndex: _selectedIndex, //New
      onTap: _onItemTapped,
      showUnselectedLabels: false,
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  static const List<Widget> _pages = <Widget>[
    Posts(),
    Posts(),
    Icon(
      Icons.chat,
      size: 150,
    ),
  ];
}


