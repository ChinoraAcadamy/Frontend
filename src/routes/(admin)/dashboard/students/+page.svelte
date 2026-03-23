<!-- src/routes/dashboard/admin/students/+page.svelte -->
<script>
	import DeleteModal from '@/lib/components/ui/modal/DeleteModal.svelte';
	import EditModal from '@/lib/components/ui/modal/EditModal.svelte';
	import { Search, Plus, Edit2, Trash2 } from 'lucide-svelte';

	// ==================== DUMMY DATA ====================
	let students = [
		{ id: 1, fullName: "Anne Smith", username: "anneesmith", phone: "+91/13456789", courses: 4, score: 60, status: "active", avatarColor: "#FF4D8D" },
		{ id: 2, fullName: "Alva Lush", username: "jolansust", phone: "+91/13456789", courses: 2, score: 80, status: "active", avatarColor: "#EF4444" },
		{ id: 3, fullName: "Lavid Smith", username: "lavidsmith", phone: "+91/13456789", courses: 3, score: 80, status: "inactive", avatarColor: "#10B981" },
		{ id: 4, fullName: "Maron Shamrad", username: "shazrmrad", phone: "+91/23457890", courses: 4, score: 76, status: "active", avatarColor: "#F59E0B" },
		{ id: 5, fullName: "Kevin Smith", username: "kaninsmith", phone: "+91/13456789", courses: 2, score: 76, status: "inactive", avatarColor: "#3B82F6" },
		{ id: 6, fullName: "Maria Hankin", username: "mariahankin", phone: "+91/13456800", courses: 7, score: 80, status: "active", avatarColor: "#EF4444" },
		{ id: 7, fullName: "Jelan Smith", username: "jelansmith", phone: "+91/23457890", courses: 10, score: 76, status: "inactive", avatarColor: "#6B7280" },
		{ id: 8, fullName: "Sara Johnson", username: "saraj", phone: "+91/98765432", courses: 5, score: 92, status: "active", avatarColor: "#8B5CF6" },
	];

	let searchQuery = $state('');
	let statusFilter = $state('all'); // 'all' | 'active' | 'inactive'
	let currentPage = $state(1);
	const itemsPerPage = 5;

	// ==================== COMPUTED ====================
	let filteredStudents = $derived.by(() => {
		return students.filter(s => {
			const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
								  s.username.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	});

	let totalPages = $derived.by(() => Math.ceil(filteredStudents.length / itemsPerPage));
	let paginatedStudents = $derived.by(() => filteredStudents.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	));

	// ==================== MODALS ====================
	let editingStudent = $state(null);
	let deletingStudent = $state(null);

	function openEdit(student) {
		editingStudent = { ...student };
		// no scrolling when modal is open, and enable it back when modal is closed
		document.body.style.overflow = 'hidden';
	}

	function openDelete(student) {
		deletingStudent = student;
		document.body.style.overflow = 'hidden';
	}

	function saveEdit() {
		const index = students.findIndex(s => s.id === editingStudent.id);
		if (index !== -1) students[index] = { ...editingStudent };
		editingStudent = null;
	}

	function confirmDelete() {
		students = students.filter(s => s.id !== deletingStudent.id);
		deletingStudent = null;
	}
</script>

<div class="students-page">
	<div class="header">
		<h1 class="title">STUDENTS LIST</h1>
		<button class="add-btn bg-primary" onclick={() => alert('Yangi shogird qo‘shish formasi tez orada qo‘shiladi')}>
			<Plus size={18} />
			Add Student
		</button>
	</div>

	<!-- Filters -->
	<div class="filters">
		<div class="search-box">
			<Search size={18} />
			<input type="text" placeholder="Search..." bind:value={searchQuery} />
		</div>

		<div class="filter-group">
			<span>Status:</span>
			<select bind:value={statusFilter}>
				<option value="all">All</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</div>

		<div class="filter-group">
			<span>Course Filter</span>
			<select>
				<option>All Courses</option>
				<option>Boshlang‘ich</option>
				<option>O‘rta</option>
				<option>Yuqori</option>
			</select>
		</div>
	</div>

	<!-- Table -->
	<div class="table-container overflow-x-scroll">
		<table class="students-table">
			<thead>
				<tr>
					<th>Full Name</th>
					<th>Username</th>
					<th>Phone</th>
					<th>Courses</th>
					<th>Total Score</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedStudents as student (student.id)}
					<tr>
						<td>
							<div class="name-cell">
								<div class="avatar" style="background: {student.avatarColor}">
									{student.fullName[0]}
								</div>
								{student.fullName}
							</div>
						</td>
						<td>{student.username}</td>
						<td>{student.phone}</td>
						<td>{student.courses}</td>
						<td class="score">{student.score}</td>
						<td>
							<span class="status-badge {student.status}">
								{student.status}
							</span>
						</td>
						<td class="actions">
							<button class="edit-btn" onclick={() => openEdit(student)}>
								<Edit2 size={18} />
							</button>
							<button class="delete-btn" onclick={() => openDelete(student)}>
								<Trash2 size={18} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	<div class="pagination">
		<button disabled={currentPage === 1} onclick={() => currentPage--}>‹</button>
		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p (p)}
			<button class={p === currentPage ? 'active bg-primary' : ''} onclick={() => currentPage = p}>
				{p}
			</button>
		{/each}
		<button disabled={currentPage === totalPages} onclick={() => currentPage++}>›</button>
	</div>
</div>

<!-- Modals -->
{#if editingStudent}
	<EditModal student={editingStudent} onSave={saveEdit} onClose={() => {editingStudent = null; document.body.style.overflow = 'auto';}} />
{/if}

{#if deletingStudent}
	<DeleteModal student={deletingStudent} onConfirm={confirmDelete} onClose={() => {deletingStudent = null; document.body.style.overflow = 'auto';}} />
{/if}

<style>
	@reference "tailwindcss";

	.students-page {
		padding: 32px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.title {
		font-size: 28px;
		font-weight: 800;
		color: #1a0e13;
		letter-spacing: -0.5px;
	}

	.add-btn {
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 12px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.add-btn:hover {
		background: #e63e7a;
		transform: translateY(-2px);
	}

	/* Filters */
	.filters {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}

	.search-box {
		flex: 1;
		min-width: 280px;
		position: relative;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		display: flex;
		align-items: center;
		padding: 0 16px;
	}

	.search-box input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		padding: 12px;
		font-size: 15px;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 8px 16px;
	}

	.filter-group select {
		background: transparent;
		border: none;
		outline: none;
		font-weight: 500;
	}

	/* Table Card */
	.table-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.06);
		overflow: hidden;
	}

	.students-table {
		width: 100%;
		border-collapse: collapse;
	}

	.students-table th {
		text-align: left;
		padding: 18px 20px;
		font-size: 13px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: #f9fafb;
	}

	.students-table td {
		padding: 18px 20px;
		border-top: 1px solid #f3f4f6;
	}

	.name-cell {
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 500;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: white;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
	}

	.status-badge {
		padding: 6px 16px;
		border-radius: 9999px;
		font-size: 13px;
		font-weight: 600;
	}

	.status-badge.active {
		background: #ECFDF5;
		color: #059669;
	}

	.status-badge.inactive {
		background: #FFF1F2;
		color: #E11D48;
	}

	.actions {
		display: flex;
		gap: 12px;
	}

	.edit-btn, .delete-btn {
		background: #f3f4f6;
		border: none;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
	}

	.edit-btn:hover { background: #e0f2fe; }
	.delete-btn:hover { background: #fee2e2; }

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 24px;
	}

	.pagination button {
		width: 36px;
		height: 36px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-weight: 600;
	}

	.pagination button.active {
		color: white;
		border: none;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.students-table {
			font-size: 14px;
		}
		.table-card {
			overflow-x: auto;
		}
	}
</style>