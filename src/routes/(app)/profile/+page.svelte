<script>
	// @ts-nocheck

	let name = 'John Doe';
	let email = 'john.doe@example.com';
	let profilePicture = 'https://via.placeholder.com/150';
	/**
	 * @param {{ target: { files: any[]; }; }} event
	 */
	function handleProfilePictureChange(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				// @ts-ignore
				profilePicture = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="profile-container">
	<img src={profilePicture} alt="Profile" class="profile-picture" />
	<div class="input-group">
		<label for="name">Name</label>
		<input id="name" type="text" bind:value={name} />
	</div>
	<div class="input-group">
		<label for="email">Email</label>
		<input id="email" type="email" bind:value={email} />
	</div>
	<div class="input-group">
		<label for="picture">Profile Picture</label>
		<input id="picture" type="file" on:change={handleProfilePictureChange} />
	</div>
	<button class="save-button">Save Changes</button>
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.profile-picture {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: 20px;
	}
	.input-group {
		margin-bottom: 15px;
	}
	.input-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}
	.input-group input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.save-button {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.save-button:hover {
		background-color: #0056b3;
	}
</style>
