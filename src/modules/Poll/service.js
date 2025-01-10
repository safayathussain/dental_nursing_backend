const { NotFound, BadRequest } = require("../../utility/errors");
const PollModel = require("./model");

const createPoll = async ({ content, options, userId }) => {
  // Check if a poll with the same content already exists
  const existingPoll = await PollModel.findOne({ content });
  if (existingPoll) {
    return {
      statusCode: 500,
      message: "Poll already exists",
      success: false,
    };
  }

  // Create a new poll
  const poll = await PollModel.create({
    content,
    options: options?.map((option) => ({ value: option, voteCount: 0 })),
    userId,
  });

  return { data: poll, message: "Poll created" };
};
const getPolls = async ({
  limit = 10,
  page = 1,
  search = "",
  latest = "false",
}) => {
  limit = Math.max(1, parseInt(limit, 10));
  page = Math.max(1, parseInt(page, 10));

  const query = {};
  if (search) {
    query.$or = [{ content: { $regex: search, $options: "i" } }];
  }
  const isLatest = latest.toLowerCase() === "true";
  const sortOption = isLatest ? { createdAt: -1 } : {};
  const polls = await PollModel.find(query)
    .populate("userId", "name email profilePicture")
    .sort(sortOption)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalCount = await PollModel.countDocuments(query);

  return {
    data: {
      data: polls,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const updatePoll = async (id, { content, options }) => {
  try {
    if (!id) {
      throw new Error("Poll ID is required");
    }

    const poll = await PollModel.findById(id);
    if (!poll) {
      return {
        statusCode: 404,
        message: "Poll not found",
        success: false,
      };
    }

    const updateData = {};
    let newOptions = [];

    // Update poll content if it has changed
    if (content && content !== poll.content) {
      updateData.content = content;
    }

    if (options?.length > 0) {
      const existingOptionIds = poll.options?.map((opt) => opt._id.toString());

      // Find existing options that are in the input
      const existingOptions = [];
      const inputOptionIds = options
        .filter((opt) => opt._id)?.map((opt) => opt._id.toString());

      options.forEach((option) => {
        if (option._id && existingOptionIds.includes(option._id.toString())) {
          existingOptions.push(option);
        } else {
          // Handle new options
          newOptions.push({
            value: option.value,
            voteCount: 0,
          });
        }
      });

      // Update existing options and remove options not in the input
      const updatedExistingOptions = poll.options
        .filter((existingOption) =>
          inputOptionIds.includes(existingOption._id.toString())
        )
        ?.map((existingOption) => {
          const updatedOption = existingOptions.find(
            (opt) => opt._id.toString() === existingOption._id.toString()
          );

          if (updatedOption) {
            return {
              ...existingOption.toObject(),
              value: updatedOption.value || existingOption.value,
              voteCount: existingOption.voteCount,
            };
          }
          return existingOption;
        });

      updateData.options = [...updatedExistingOptions, ...newOptions];
    }

    // Only proceed with update if there are changes
    if (Object.keys(updateData).length === 0) {
      return {
        data: poll,
        message: "Nothing to update",
        success: true,
      };
    }

    // Update the poll in the database
    const updatedPoll = await PollModel.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      data: updatedPoll,
      message: `Poll updated successfully`,
      success: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: `Error updating poll: ${error.message}`,
      success: false,
    };
  }
};

const deletePoll = async (id) => {
  const poll = await PollModel.findOneAndDelete({ _id: id });
  if (!poll) {
    return {
      statusCode: 404,
      message: "Poll not found",
      success: false,
    };
  }

  return {
    data: poll,
    message: "Poll deleted",
  };
};

const voteInPoll = async (pollId, optionId, userId) => {
  // Find the poll by ID
  const poll = await PollModel.findById(pollId);
  if (!poll) {
    return {
      statusCode: 404,
      message: "Poll not found",
      success: false,
    };
  }
  if (poll.votedUser.includes(userId)) {
    return {
      statusCode: 403,
      message: "You’ve already voted in this poll",
      success: false,
    };
  }
  const option = poll.options.find((opt) => opt._id.toString() === optionId);
  if (!option) {
    return {
      statusCode: 404,
      message: "Option not found",
      success: false,
    };
  }
  const newPollResponse = await PollModel.PollResponse.create({
    pollId,
    userId,
    optionId,
  });
  option.voteCount += 1;
  poll.votedUser.push(userId);
  poll.votedCount += 1;
  await poll.save();
  return {
    data: poll,
    message: "Vote submitted successfully",
  };
};

module.exports = {
  createPoll,
  updatePoll,
  deletePoll,
  voteInPoll,
  getPolls,
};
