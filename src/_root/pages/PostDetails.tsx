import Loader from "../../components/shared/Loader";
import { useGetPostById } from "../../lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";
import { formatDateString } from "../../lib/utils";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isLoading, error } = useGetPostById(id || '');

  if (isLoading) return <Loader />;
  if (error || !post) return <div>Failed to load post data. Please try again.</div>;

  return (
    <div className="post_details_container">
      <div>
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:hg-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-1 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
