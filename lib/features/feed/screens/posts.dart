import 'dart:io';
import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:congressional_app/features/feed/screens/mainpage.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class Posts extends StatefulWidget {
  const Posts({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _PostsState createState() => _PostsState();
}

class _PostsState extends State<Posts> {
  bool button1IsPressed = false;
  bool button2IsPressed = true;
  final storageRef = FirebaseStorage.instance.ref();
  final captionInput = TextEditingController();
  String postingWhere = 'Neighborhood';
  // ignore: prefer_typing_uninitialized_variables
  var imageUrl;
  File? _selectedImage;

  final User? currentUser = FirebaseAuth.instance.currentUser;

  Future getImageCamera() async {
    final image = await ImagePicker().pickImage(source: ImageSource.camera);
    if (image == null) return;

    final imageTemp = File(image.path);
    setState(() {
      _selectedImage = imageTemp;
    });
  }

  Future getImageGallery() async {
    final image = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (image == null) return;

    final imageTemp = File(image.path);
    setState(() {
      _selectedImage = imageTemp;
    });
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
      leadingWidth: 130,
      titleSpacing: 0,
      title: const Text("P O S T",
          style: TextStyle(
            color: Colors.black,
            fontSize: 30,
          )),
      centerTitle: true,
    );
  }

  _body(context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    if (button2IsPressed) {
                      print(button1IsPressed);
                      button1IsPressed = !button1IsPressed;
                      postingWhere = "Neighborhood";
                    }
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor:
                      button1IsPressed ? Colors.grey : Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'NEIGHBORHOOD',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    if (button1IsPressed) {
                      print(button2IsPressed);
                      button2IsPressed = !button2IsPressed;
                      postingWhere = "City";
                    }
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor:
                      button2IsPressed ? Colors.grey : Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'CITY',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        const Text(
          'UPLOAD AN IMAGE',
          style: TextStyle(
            color: Colors.black,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: () async {
                  getImageGallery();
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'FROM GALLERY',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  getImageCamera();
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'FROM CAMERA',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        const SizedBox(height: 20),
        const Text(
          'DESCRIPTION',
          style: TextStyle(
            color: Colors.black,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          onTapOutside: (event) {
            print('onTapOutside');
            FocusManager.instance.primaryFocus?.unfocus();
          },
          controller: captionInput,
          maxLines: 5,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: BorderSide.none,
            ),
            fillColor: Colors.black.withOpacity(0.1),
            filled: true,
          ),
          obscureText: false,
        ),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: () async {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const MainPage()),
            );
            if (_selectedImage != null) {
              String email = currentUser!.email ?? '';
              final imageRef = storageRef.child('postImages').child('${_randomString(5)}.jpg');
              await imageRef.putFile(_selectedImage!);
              try {
                var imageUrl = await imageRef.getDownloadURL();
                createPostDoc(postingWhere, imageUrl, captionInput.text);
                print('post doc created');
              } on Exception {
                print('error');
              }
            } else {
              print("image not found");
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text(
            'Post',
            style: TextStyle(
              color: Colors.white,
              fontSize: 30,
            ),
          ),
        ),
      ],
    );
  }

  Future<void> createPostDoc(
    String postingWhere,
    String imagePath,
    String description,
  ) async {
    await FirebaseFirestore.instance.collection('PostData').doc().set({
      'user': currentUser!.email,
      'post location': postingWhere,
      'image path': imagePath,
      'description': description,
      'timestamp': Timestamp.now(),
    });
  }

  String _randomString(length) {
    const chars =
        'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    Random rnd = Random();

    return String.fromCharCodes(Iterable.generate(
        length, (_) => chars.codeUnitAt(rnd.nextInt(chars.length))));
  }
}
