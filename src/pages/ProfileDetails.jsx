import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import PageFrame from '../components/PageFrame'
import PublicProfileSnapshot from '../components/PublicProfileSnapshot'
import { selectProfile, selectProfileError, selectProfileStatus } from '../Redux/slices/profileSlice'
import { fetchPublicProfile } from '../Redux/thunks/profileThunks'

function ProfileDetails() {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const profile = useSelector(selectProfile)
  const status = useSelector(selectProfileStatus)
  const error = useSelector(selectProfileError)

  useEffect(() => {
    if (userId) {
      dispatch(fetchPublicProfile(userId))
    }
  }, [dispatch, userId])

  const showLoadingPanel = status === 'loading' && !profile
  const showErrorPanel = status === 'error'
  const showNotFoundPanel = status === 'loaded' && !profile

  return (
    <PageFrame id="profile-details">
      <section className="panel profile-top">
        <div className="profile-top-row">
          <Link className="pill small profile-back-link" to="/">
            ← Back to profiles
          </Link>
          <span className="pill small">{status === 'loading' ? 'Syncing profile...' : 'Full profile'}</span>
        </div>
      </section>

      {showLoadingPanel && (
        <section className="panel">
          <p className="muted">Loading profile details...</p>
        </section>
      )}

      {showErrorPanel && (
        <section className="panel">
          <p className="muted">Unable to load profile details. {error}</p>
        </section>
      )}

      {showNotFoundPanel && (
        <section className="panel">
          <p className="muted">Profile details are not available yet for this user.</p>
        </section>
      )}

      {!showErrorPanel && profile && <PublicProfileSnapshot profile={profile} />}
    </PageFrame>
  )
}

export default ProfileDetails
