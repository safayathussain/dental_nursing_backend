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
    options: options.map((option) => ({ value: option, voteCount: 0 })),
    userId,
  });

  return { data: poll, message: "Poll created successfully" };
};

const updatePoll = async (id, { content, options }) => {
  try {
    if (!id) {
      throw new Error('Poll ID is required');
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
    if (content && content !== poll.content) {
      updateData.content = content;
    }
    if (options?.length > 0) {
      const existingOptionIds = poll.options.map(opt => opt._id.toString());
      const existingOptions = [];
      options.forEach(option => {
        if (option._id && existingOptionIds.includes(option._id.toString())) {
          existingOptions.push(option);
        } else {
          newOptions.push({
            value: option.value,
            voteCount: 0   
          });
        }
      });
      const updatedExistingOptions = poll.options.map(existingOption => {
        const updatedOption = existingOptions.find(opt => 
          opt._id.toString() === existingOption._id.toString()
        );

        if (updatedOption) {
          return {
            ...existingOption.toObject(),
            value: updatedOption.value || existingOption.value,
            voteCount: existingOption.voteCount
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
        message: "No changes to update",
        success: true,
      };
    }

    // Update the poll in the database
    const updatedPoll = await PollModel.findOneAndUpdate(
      { _id: id }, 
      updateData,
      {
        new: true,
        runValidators: true
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
    message: "Poll deleted successfully",
  };
};

const voteInPoll = async (pollId, optionId) => {
  // Find the poll by ID
  const poll = await PollModel.findById(pollId);
  if (!poll) {
    return {
      statusCode: 404,
      message: "Poll not found",
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
  option.voteCount += 1;
  poll.votedCount += 1;
  await poll.save();
  return {
    data: poll,
    message: "Vote cast successfully",
  };
};

module.exports = {
  createPoll,
  updatePoll,
  deletePoll,
  voteInPoll,
};
