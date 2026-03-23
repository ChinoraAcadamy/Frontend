<script lang="ts">
	import StatCard from '@/lib/components/ui/courses/StatCard.svelte';
	import InputField from '@/lib/components/ui/InputField.svelte';
    import { Users, BookOpen, FileText, Pencil } from 'lucide-svelte';

    // Mock form datalari (Svelte 5 state)
    let form = $state({
        firstName: 'First name',
        lastName: '',
        phone: '',
        username: 'Username',
        password: '••••••••••••',
        role: 'Role'
    });

    // Mock timeline datalari
    const activities = [
        { id: 1, title: 'Course completed', date: 'Jan 27, 2022', points: '+20 point' },
        { id: 2, title: 'Quiz submission', date: 'Jan 21, 2022', points: '+10 point' },
        { id: 3, title: 'Quiz submission', date: 'Jan 27, 2022', points: '+30 point' },
    ];
</script>

<div class="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-[#f8fafc] font-sans space-y-6">

    <div class="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-8">Profile Settings</h2>
        
        <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            <div class="flex flex-col items-center gap-4 shrink-0 w-32">
                <div class="relative w-32 h-32 rounded-full bg-[#dbeafe] flex items-end justify-center overflow-hidden shrink-0 border border-slate-100">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" 
                        alt="Profile" 
                        class="w-28 h-28 object-cover translate-y-2"
                        width="112" height="112" 
                    />
                    <button class="absolute bottom-0 right-0 w-8 h-8 bg-[#ed4b72] text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform border-2 border-white">
                        <Pencil size={14} />
                    </button>
                </div>
                
                <p class="text-sm font-semibold text-slate-700">Profile picture</p>
                
                <button class="w-full h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-center p-2 hover:bg-slate-100 transition-colors shrink-0">
                    <span class="text-xs font-medium text-slate-500">Profile picture upload</span>
                </button>
            </div>

            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <InputField id="firstName" label="Name" bind:value={form.firstName} />
                <InputField id="username" label="Username" bind:value={form.username} readonly />
                
                <InputField id="lastName" label="Last name" bind:value={form.lastName} placeholder="Last name" />
                <InputField id="password" type="password" label="Password" bind:value={form.password} readonly />
                
                <InputField id="phone" label="Phone number" bind:value={form.phone} prefix="+998 |" />
                <InputField id="role" label="Role" bind:value={form.role} readonly />

                <div class="sm:col-start-2 flex items-end justify-end mt-2">
                    <button class="w-full h-11 bg-[#ed4b72] hover:bg-[#de3c61] text-white rounded-xl font-bold transition-colors shadow-sm shadow-rose-200">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div>
        <h2 class="text-xl font-bold text-slate-800 mb-4 px-2">My Stats</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total score" value="350" isPrimary={true}>
                    <Users size={24} />
                </StatCard>
                
                <StatCard title="Courses count" value="40">
                    <BookOpen size={24} strokeWidth={1.5} />
                </StatCard>
                
                <StatCard title="Submissions count" value="3">
                    <FileText size={24} strokeWidth={1.5} />
                </StatCard>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full min-h-35">
                <h3 class="text-[17px] font-bold text-slate-800 mb-5">Score history or activity</h3>
                
                <div class="relative pl-3 space-y-5">
                    <div class="absolute left-1.25 top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>
                    
                    {#each activities as item, i (item.id)}
                        <div class="relative pl-5">
                            <div class="absolute -left-2.5 top-1.5 w-2.5 h-2.5 rounded-full {i === 2 ? 'bg-[#ed4b72] ring-4 ring-rose-50' : 'bg-slate-300'}"></div>
                            
                            <div class="flex justify-between items-start gap-4">
                                <div>
                                    <p class="text-sm font-semibold text-slate-800">{item.title}</p>
                                    <p class="text-[13px] font-medium text-slate-400 mt-0.5">{item.date}</p>
                                </div>
                                <span class="text-sm font-semibold text-[#10b981] whitespace-nowrap">
                                    {item.points}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

</div>