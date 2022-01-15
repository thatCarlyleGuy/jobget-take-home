import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { AccessTime, RestartAlt } from '@mui/icons-material';

const Result = ({ title, companyName, snippet, postedDate, url, source }) => {
  return (
    <Box sx={{ minWidth: 275, paddingY: 1 }}>
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              justifyContent: 'space-between',
              marginBottom: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 'normal', display: 'flex' }}
            >
              <AccessTime fontSize="small" sx={{ marginRight: 0.5 }} />
              {postedDate}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 'normal', display: 'flex' }}
            >
              <RestartAlt fontSize="small" sx={{ marginRight: 0.5 }} />
              {source}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="div"
            color="text.secondary"
            sx={{ fontWeight: 'medium' }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              marginTop: 1,
              marginBottom: 2,
              fontWeight: 'medium',
            }}
          >
            {companyName}
          </Typography>
          <Typography variant="body2">
            <span dangerouslySetInnerHTML={{ __html: snippet }} />
          </Typography>
        </CardContent>

        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="contained"
            color="secondary"
            href={url}
            sx={{
              textTransform: 'none',
              boxShadow: 0,
              borderRadius: 30,
            }}
          >
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

Result.propTypes = {
  title: PropTypes.string,
  companyName: PropTypes.string,
  salary: PropTypes.string,
  snippet: PropTypes.string,
  postedDate: PropTypes.string,
  url: PropTypes.string,
  source: PropTypes.string,
};

export default Result;
