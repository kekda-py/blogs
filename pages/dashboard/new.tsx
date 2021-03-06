import { Button, MantineProvider, Select } from '@mantine/core'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { AiFillGithub } from 'react-icons/ai'
import useAuth from '../../hooks/useAuth'
import { MdNavigateNext } from 'react-icons/md'
import { useRouter } from 'next/router'

interface Repo {
	path: string;
	private: boolean;
}

const DashboardNew: NextPage = () => {
	
	const { user, Login, Logout } = useAuth(() => { Login() })

	const router = useRouter();
	
	const [repos, setRepos] = useState<Repo[]>([])
	const [selectedRepo, setSelectedRepo] = useState<string>("");
	const [loading,setLoading] = useState<boolean>(false);

	async function doIt() {
		if (selectedRepo === "" || selectedRepo === undefined || selectedRepo === null) return
		setLoading(true)
		fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}update_user?username=${user?.username}&repo=${selectedRepo}`,
		).then(
			async (resp) => {
				const json = await resp.json();
				console.log(json)

				window.location.href = "https://github.com/apps/blogs-for-you/installations/new"

				setLoading(false)
			}
		)
	}

	useEffect(() => {
		if (user) {
			setLoading(true);
			fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}get_repos?username=${user.username}`).then(
				async (resp) => {
					const json = await resp.json();
					const result : Repo[] = [];

					json.forEach((repo : any) => {
						result.push({
							path: repo.full_name,
							private: repo.private
						})
					});

					setRepos(result)

					setLoading(false)
				}
			)
		}
		
	},[user])

	return (
		<div className="w-screen min-h-screen bg-black text-neutral-100 ">
			<div className="flex flex-col items-center justify-center">
				<h1 className="pt-12 pb-24 text-center text-4xl">
					Import a repository from GitHub
				</h1>
				<MantineProvider theme={{ colorScheme: 'dark' }}>
					<div className="flex items-center justify-center">
						<AiFillGithub size={50} />
						<Select
							sx={{
								paddingLeft: '1rem',
								width: '100%',
							}}
							searchable
							size="lg"
							label="Pick a repository"
							placeholder="You can only pick Public repos"
							className='sm:w-96'
							disabled={loading}
							data={(() => {
								interface Result {
									value: string;
									label: string;
								}
								const result: Result[] = []
								repos.forEach((repo : Repo) => {
									result.push({
										value : repo.path,
										label : `${repo.path}`
									})
								});
								return result
							})()}
							onChange={(value : string) => {
								setSelectedRepo(value)
							}}
						/>
					</div>

					<Button
						className=' mt-5 bg-green-500'
						color='green'
						size='md'
						loading={loading}
						disabled={selectedRepo === "" || selectedRepo === undefined || selectedRepo === null}
						onClick={(e : any) => {
							e.preventDefault();
							doIt()
						}}
					>
						Next <MdNavigateNext fontSize='20px' />
					</Button>
				</MantineProvider>
			</div>
		</div>
	)
}

export default DashboardNew
