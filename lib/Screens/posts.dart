import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class Posts extends StatefulWidget {
  Posts({super.key});

  @override
  _PostsState createState() => _PostsState();
}

class _PostsState extends State<Posts> {
  final storageRef = FirebaseStorage.instance.ref();
  final captionInput = TextEditingController();
  late String postingWhere;
  File? _selectedImage;

  final User? currentUser = FirebaseAuth.instance.currentUser;

  // Request permissions for storage and camera
  Future<bool> _requestPermission(Permission permission) async {
    var status = await permission.status;
    if (!status.isGranted) {
      status = await permission.request();
    }
    return status.isGranted;
  }

  // Function to pick an image from the gallery
  Future<void> _pickImageFromGallery() async {
    if (await _requestPermission(Permission.storage)) {
      try {
        final picker = ImagePicker();
        final pickedFile = await picker.pickImage(source: ImageSource.gallery);

        if (pickedFile != null) {
          setState(() {
            _selectedImage = File(pickedFile.path);
          });
        } else {
          print("No image selected");
        }
      } catch (e) {
        print("Error picking image from gallery: $e");
      }
    } else {
      print("Storage permission denied");
    }
  }

  // Function to pick an image from the camera
  Future<void> _pickImageFromCamera() async {
    if (await _requestPermission(Permission.camera)) {
      try {
        final picker = ImagePicker();
        final pickedFile = await picker.pickImage(source: ImageSource.camera);

        if (pickedFile != null) {
          setState(() {
            _selectedImage = File(pickedFile.path);
            print(_selectedImage?.path);
          });
        } else {
          print("No image captured");
        }
      } catch (e) {
        print("Error picking image from camera: $e");
      }
    } else {
      print("Camera permission denied");
    }
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
                    postingWhere = "Neighborhood";
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: Colors.black,
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
                    postingWhere = "City";
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: Colors.black,
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
                onPressed: () {
                  _pickImageFromGallery();
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
                  _pickImageFromCamera();
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
        if (_selectedImage != null)
          Image.file(
            _selectedImage!,
            height: 200,
            width: 200,
            fit: BoxFit.cover,
          ),
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
          onPressed: () {
            createPostDoc(postingWhere, _selectedImage!.path, captionInput.text);
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
    await FirebaseFirestore.instance
        .collection('PostData')
        .doc(currentUser!.email)
        .set({
      'user': currentUser,
      'post location': postingWhere,
      'image path':imagePath,
      'description': description,
    });
  }
}
