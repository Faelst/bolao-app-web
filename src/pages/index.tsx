import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExImg from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
}

export default function Home({ poolCount, guessCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    if (poolTitle == '') {
      return alert('Insira o titulo do bolão corretamente')
    }

    try {
      const { data: poll } = await api.post('/pools', {
        title: poolTitle,
      })

      navigator.clipboard.writeText(poll.code)

      alert(
        'Bolão criado com sucesso, código copiado para area de transferência',
      )

      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert('Insira o titulo do bolão corretamente')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos !
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+12.592</span> pessoas já estão
            usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          ></input>
          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm hover:bg-yellow-700">
            CRIAR MEU BOLÃO
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100">
          <div className="flex item-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-16 bg-gray-600"></div>
          <div className="flex item-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma previa da aplicação movel do NLW Edição Copa do mundo"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const { data: pools } = await api.get('/pools/count')
  const { data: guesses } = await api.get('/pools/count')

  return {
    props: {
      poolCount: pools.count,
      guessCount: guesses.count,
    },
  }
}
