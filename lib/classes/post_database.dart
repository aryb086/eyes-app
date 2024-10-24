import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class PostDatabase {
  User? user = FirebaseAuth.instance.currentUser;

  final CollectionReference posts =
      FirebaseFirestore.instance.collection('PostData');

  Stream<QuerySnapshot> getPosts() {
    final postStream = FirebaseFirestore.instance
        .collection('Posts')
        .orderBy('timestamp', descending: true)
        .snapshots();

    return postStream;
  }
}
