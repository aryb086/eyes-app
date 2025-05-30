import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:congressional_app/features/setup/screens/join_city.dart';
import 'package:congressional_app/features/setup/screens/join_nh.dart';
import 'package:congressional_app/classes/post_database.dart';
import 'package:congressional_app/common/widgets/post_widget.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  Home({super.key});

  final PostDatabase database = PostDatabase();

  final User? currentUser = FirebaseAuth.instance.currentUser;

  Future<DocumentSnapshot<Map<String, dynamic>>> getUserDetails() async {
    return await FirebaseFirestore.instance
        .collection('UserData')
        .doc(currentUser!.email)
        .get();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          const SizedBox(
            height: 10,
          ),
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
      title: const Text("E Y E S",
          style: TextStyle(
              color: Colors.black,
              fontSize: 30,)),
      centerTitle: true,
    );
  }

_body(context) {

  // Return the FutureBuilder widget
  return FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
    future: getUserDetails(),
    builder: (context, snapshot) {

      // Check for connection state, errors, and data presence
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Center(child: CircularProgressIndicator());
      } else if (snapshot.hasError) {
        return const Text("Error");
      } else if (snapshot.hasData) {
        Map<String, dynamic>? user = snapshot.data?.data();

        // Safely check if user data is null
        if (user != null) {
          var citySetup = user['city setup'] ?? false;
          var neighborhoodSetup = user['neighborhood setup'] ?? false;

          // Handling conditions more explicitly
          if (!citySetup && !neighborhoodSetup) {
            return buildContainer(
              "Join your city",
              () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const JoinCity()),
                );
              },
              "Join your neighborhood",
              () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const JoinNeighborhood()),
                );
              },
            );
          } else if (citySetup && !neighborhoodSetup) {
            return buildContainer(
              "Join your neighborhood",
              () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const JoinNeighborhood()),
                );
              },
            );
          } else if (!citySetup && neighborhoodSetup) {
            return buildContainer(
              "Join your city",
              () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const JoinCity()),
                );
              },
            );
          }

          // Optional: If both are true, or any other fallback logic
          return _feed(context);
        } else {
          return const Text("User data is null");
        }
      } else {
        return const Text('No data');
      }
    },
  );
}

// Reusable function for building modern containers with a clean UI
Widget buildContainer(String label1, VoidCallback onPressed1, [String? label2, VoidCallback? onPressed2]) {
  return Container(
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(15),  // Softer corners for modern look
      color: Colors.white,
      boxShadow: [
        BoxShadow(
          color: Colors.grey.withOpacity(0.2),  // Subtle shadow for depth
          spreadRadius: 5,
          blurRadius: 7,
          offset: const Offset(0, 3),  // Position of the shadow
        ),
      ],
    ),
    padding: const EdgeInsets.all(20),  // Internal padding
    margin: const EdgeInsets.symmetric(vertical: 15),  // Margin between containers
    width: 300,  // Fixed width (can be adjusted based on requirements)
    child: Column(  
      crossAxisAlignment: CrossAxisAlignment.center,  // Align content to the start
      children: [
        const Text(
          "To Do",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.black87,  // Use a slightly muted black
          ),
        ),
        const SizedBox(height: 10),  // Space between title and buttons

        // First Button (ElevatedButton)
        SizedBox(
          width: double.infinity,  // Button takes up full width
          child: ElevatedButton(
            onPressed: onPressed1,
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),  // Rounded button
              ),
              padding: const EdgeInsets.symmetric(vertical: 15),  // Larger touch target
              backgroundColor: Colors.black,  // Accent color
            ),
            child: Text(
              label1,
              style: const TextStyle(
                fontSize: 20,  // Modern font size
                fontWeight: FontWeight.w500,
                color: Colors.white,  // White text for elevated button
              ),
            ),
          ),
        ),

        if (label2 != null && onPressed2 != null) ...[
          const SizedBox(height: 10),  // Space between buttons

          // Second Button (OutlinedButton)
          SizedBox(
            width: double.infinity,  // Button takes up full width
            child: OutlinedButton(
              onPressed: onPressed2,
              style: OutlinedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),  // Rounded button
                ),
                side: const BorderSide(color: Colors.black),  // Border color for outlined button
                padding: const EdgeInsets.symmetric(vertical: 15),  // Larger touch target
              ),
              child: Text(
                label2,
                style: const TextStyle(
                  fontSize: 20,  // Modern font size
                  fontWeight: FontWeight.w500,
                  color: Colors.black,  // Blue accent text for outlined button
                ),
              ),
            ),
          ),
        ],
      ],
    ),
  );
}

_feed(context){
  return StreamBuilder(
    stream: database.getPosts(),
    builder: (context, snapshot){
      if(snapshot.connectionState == ConnectionState.waiting){
        return const Center(
          child: CircularProgressIndicator()
        );
      }
      final posts = snapshot.data!.docs;

      if (snapshot.data == null || posts.isEmpty){
        return const Center(
          child: Padding(padding: EdgeInsets.all(24), child: Text('Nothing yet. Post something!'),),
        );
      }

      return Expanded(
        child: ListView.builder(
          itemCount: posts.length,
          itemBuilder: (context, index){
            final post = posts[index];

            String description = post['description'];
            String? email = currentUser!.email;

            return ListTile(
              title: Text(description, style: const TextStyle(color: Colors.black, fontSize: 15,)),
              subtitle: const Text("aryb086")
            );
          },
        )
      );
    },
  );
}
}
