import 'package:flutter/material.dart';

class PostWidget extends StatelessWidget {
  final String imagelink;
  final String caption;

  const PostWidget({
    super.key,
    required this.imagelink,
    required this.caption,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image post
          Image.network(
            imagelink,
            fit: BoxFit.cover,
            width: double.infinity,
            height: 300, // Adjust as needed
          ),

          const SizedBox(height: 10),

          // Post caption
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Text(
              caption,
              style: const TextStyle(
                color: Colors.black,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
