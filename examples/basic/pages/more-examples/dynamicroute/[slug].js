import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import getT from 'next-translate/getT'
import { useRouter } from 'next/router'

export default function DynamicRoute({ title, url }) {
  const { query } = useRouter()
  const { t, lang } = useTranslation()

  console.log({ query, url })

  return (
    <>
      <h1>{title}</h1>
      <h2>{t`more-examples:dynamic-route`}</h2>
      <h3>
        {query.slug} - {lang}
      </h3>
      <Link href="/">{t`more-examples:go-to-home`}</Link>
    </>
  )
}

/**
 * https://github.com/vercel/next.js/discussions/32243
 */
const onlyOnFirstServerCall = (getServerSidePropsFunction) => {
  return async (context) => {
    const isFirstServerCall = context.req?.url?.indexOf('/_next/data/') === -1
    if (!isFirstServerCall) {
      return {
        props: { url: context.req?.url },
      }
    }
    return getServerSidePropsFunction(context)
  }
}

export const getServerSideProps = onlyOnFirstServerCall(
  async ({ locale, req }) => {
    const t = await getT(locale, 'common')
    return { props: { title: t('title'), url: req?.url } }
  }
)
