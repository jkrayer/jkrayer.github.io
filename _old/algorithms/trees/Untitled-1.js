// Javascript program to implement optimized delete in BST.

class Node {
constructor(key) {
	this.key = key;
	this.left = null;
	this.right = null;
}
}

// A utility function to do inorder traversal of BST
function inorder(root) {
if (root !== null) {
	inorder(root.left);
	console.log(root.key);
	inorder(root.right);
}
}

/* A utility function to insert a new node with given key in
* BST */
function insert(node, key) {
/* If the tree is empty, return a new node */
if (node === null) {
	return new Node(key);
}

/* Otherwise, recur down the tree */
if (key < node.key) {
	node.left = insert(node.left, key);
} else {
	node.right = insert(node.right, key);
}

/* return the (unchanged) node pointer */
return node;
}

/* Given a binary search tree and a key, this function
deletes the key and returns the new root */
function deleteNode(root, k) { // 1: k70, 70
// Base case
if (root === null) {
	return root;
}

// Recursive calls for ancestors of
// node to be deleted
if (root.key > k) {
	root.left = deleteNode(root.left, k);
	return root;
} else if (root.key < k) {
	root.right = deleteNode(root.right, k); // k70, 70
	return root;
}

// We reach here when root is the node
// to be deleted.

// If one of the children is empty
if (root.left === null) {
	let temp = root.right;
	delete root;
	return temp;
} else if (root.right === null) {
	let temp = root.left;
	delete root;
	return temp;
}

// If both children exist
else {
	let succParent = root; // 70

	// Find successor
	let succ = root.right; // 80
	while (succ.left !== null) { // 78
	succParent = succ; // 79
	succ = succ.left;  // 78
	}

	// Delete successor. Since successor
	// is always left child of its parent
	// we can safely make successor's right
	// right child as left of its parent.
	// If there is no succ, then assign
	// succ.right to succParent.right
	if (succParent !== root) {
	succParent.left = succ.right; // 80.left = 79.right
	} else {
	succParent.right = succ.right; /// 70.right = 80.right
	}

	// Copy Successor Data to root
	root.key = succ.key; // 70.key = 80.key

	// Delete Successor and return root
	delete succ; // delete 80
	return root;
}
}

// Driver Code
(function main() {
/* Let us create following BST
			50
		  /	 \
		30	 70             78
		/ \  / \           /  \
	20 40   60 80         60  80
	           /               /        
			  79              79
			  /               
			78               
	*/
let root = null;
root = insert(root, 50);
root = insert(root, 30);
root = insert(root, 20);
root = insert(root, 40);
root = insert(root, 70);
root = insert(root, 60);

console.log("Original BST: ");
inorder(root);

console.log("\n\nDelete a Leaf Node: 20\n");
root = deleteNode(root, 20);
console.log("Modified BST tree after deleting Leaf Node:\n");
inorder(root);

console.log("\n\nDelete Node with single child: 70\n");
root = deleteNode(root, 70);
console.log("Modified BST tree after deleting single child Node:\n");
inorder(root);

console.log("\n\nDelete Node with both child: 50\n");
root = deleteNode(root, 50);
console.log("Modified BST tree after deleting both child Node:\n");
inorder(root);
})();
